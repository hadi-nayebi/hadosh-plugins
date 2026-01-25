import path from "node:path"
import { promises as fs } from "node:fs"
import { fileURLToPath } from "node:url"

const WM_FILE = "WM.md"
const MIN_WORDS = 50
const WORD_RE = /\S+/g

const PLUGIN_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)))
const STATE_PATH = path.join(PLUGIN_ROOT, "state", "data.json")
const DEFAULT_STATE = {
  config: {
    sleepEnabled: true,
    sleepTriggerCount: 10,
    telemetryEnabled: true,
    telemetryMaxEntries: 500,
    externalAllowRoots: [],
    readOnlyRoots: [],
  },
  sleep: {},
  telemetry: [],
}

const callState = new Map()
const allowBashBySession = new Map()
const validationCache = new Map()
const CACHE_TTL = 5000 // 5 seconds
let stateCache = null
let stateLoaded = false

// Clean up expired session allowances every minute
setInterval(() => {
  const now = Date.now()
  for (const [id, entry] of allowBashBySession) {
    if (!entry || entry.expires < now) {
      allowBashBySession.delete(id)
    }
  }

  for (const [key, cached] of validationCache) {
    if (!cached || now - cached.timestamp > CACHE_TTL) {
      validationCache.delete(key)
    }
  }
}, 60000).unref() // unref so it doesn't keep the process alive

const toPosix = (value) => value.split(path.sep).join("/")

const normalizeRel = (root, value) => {
  const rel = path.relative(root, value)
  if (!rel) {
    return "."
  }
  return toPosix(rel)
}

const normalizeEntry = (value, isDir) => {
  const normalized = toPosix(value)
  if (isDir) {
    return normalized.endsWith("/") ? normalized : `${normalized}/`
  }
  return normalized.replace(/\/$/, "")
}

const countWords = (value) => {
  if (!value) {
    return 0
  }
  const matches = value.match(WORD_RE)
  return matches ? matches.length : 0
}

const normalizeRoots = (roots = []) => roots.map((root) => path.resolve(root))

const isUnderRoot = (target, root) => {
  const rel = path.relative(root, target)
  return rel === "" || (!rel.startsWith("..") && !path.isAbsolute(rel))
}

const matchesRoots = (target, roots) => {
  for (const root of roots) {
    if (target === root || target.startsWith(`${root}${path.sep}`)) {
      return true
    }
  }
  return false
}

const summarizeStatus = (status) => ({
  missing: status.missing.length,
  extra: status.extra.length,
  stale: status.stale.length,
  over_limit: status.over_limit.length,
  notes: status.notes.length,
})

const loadState = async () => {
  if (stateLoaded && stateCache) {
    return stateCache
  }

  try {
    const raw = await fs.readFile(STATE_PATH, "utf8")
    stateCache = JSON.parse(raw)
  } catch {
    stateCache = JSON.parse(JSON.stringify(DEFAULT_STATE))
    await saveState(stateCache)
  }

  stateLoaded = true
  return stateCache
}

const saveState = async (state) => {
  try {
    await fs.mkdir(path.dirname(STATE_PATH), { recursive: true })
    await fs.writeFile(STATE_PATH, `${JSON.stringify(state, null, 2)}\n`)
  } catch {
    // Ignore state write errors; enforcement should still proceed.
  }
}

const logTelemetry = async (state, entry) => {
  const config = state?.config ?? {}
  if (config.telemetryEnabled === false) {
    return
  }
  const maxEntries = Number.isFinite(config.telemetryMaxEntries)
    ? Math.max(0, config.telemetryMaxEntries)
    : 0
  if (!state.telemetry) {
    state.telemetry = []
  }
  state.telemetry.push(entry)
  if (maxEntries > 0 && state.telemetry.length > maxEntries) {
    state.telemetry = state.telemetry.slice(-maxEntries)
  }
  await saveState(state)
}

const createStatus = () => ({
  missing: [],
  extra: [],
  stale: [],
  over_limit: [],
  notes: [],
  next_actions: [],
})

const addAction = (status, action) => {
  if (!action) {
    return
  }
  if (!status.next_actions.includes(action)) {
    status.next_actions.push(action)
  }
}

const addIssue = (status, field, label, items) => {
  if (!items || items.length === 0) {
    return
  }
  status[field].push(`${label}: ${items.join(", ")}`)
}

const formatStatus = (status) => {
  const lines = ["WM-STATUS"]
  const keys = ["missing", "extra", "stale", "over_limit", "notes", "next_actions"]
  let hasData = false

  for (const key of keys) {
    const values = status[key]
    if (values && values.length) {
      hasData = true
      lines.push(`- ${key}: ${values.join(" | ")}`)
    }
  }

  if (!hasData) {
    lines.push("- ok: true")
  }

  return lines.join("\n")
}

const formatChain = (root, chain) => {
  return chain
    .map(({ dir, content }) => {
      const relDir = normalizeRel(root, dir)
      const label = relDir === "." ? WM_FILE : `${relDir}/${WM_FILE}`
      return `--- ${label} ---\n${content}`
    })
    .join("\n\n")
}

const parseCommentary = (content) => {
  const blockMatch = content.match(/<directory-commentary>([\s\S]*?)<\/directory-commentary>/i)
  if (!blockMatch) {
    return { missingBlock: true }
  }

  const block = blockMatch[1]
  const fileEntries = new Map()
  const subdirEntries = new Map()

  for (const match of block.matchAll(/<file\s+path="([^"]+)"[^>]*>([\s\S]*?)<\/file>/gi)) {
    const entryPath = normalizeEntry(match[1].trim(), false)
    fileEntries.set(entryPath, match[2].trim())
  }

  for (const match of block.matchAll(/<subdir\s+path="([^"]+)"[^>]*>([\s\S]*?)<\/subdir>/gi)) {
    const entryPath = normalizeEntry(match[1].trim(), true)
    subdirEntries.set(entryPath, match[2].trim())
  }

  const hasException = /<exception\b[^>]*>[\s\S]*?<\/exception>/i.test(block)
  const hasReorg = /<note\s+type=["']reorg["'][^>]*>[\s\S]*?<\/note>/i.test(block)

  return {
    missingBlock: false,
    block,
    fileEntries,
    subdirEntries,
    hasException: hasException || hasReorg,
  }
}

const listDirectory = async (dirPath) => {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true })
    const files = []
    const dirs = []

    for (const entry of entries) {
      if (entry.name === WM_FILE) {
        continue
      }
      if (entry.isDirectory()) {
        dirs.push(normalizeEntry(entry.name, true))
      } else {
        files.push(normalizeEntry(entry.name, false))
      }
    }

    return { files, dirs }
  } catch (error) {
    // If we can't list the directory, return empty to fail open or handle gracefully upstream
    // Ideally we'd throw a specific error, but for now empty is safer than crash
    return { files: [], dirs: [], error }
  }
}

const validateDirectory = async (root, dirPath, options = {}) => {
  const resolvedDir = path.resolve(dirPath)
  const allowRoots = normalizeRoots(options.externalAllowRoots)
  if (!isUnderRoot(resolvedDir, root) && matchesRoots(resolvedDir, allowRoots)) {
    const status = createStatus()
    status.notes.push(`external allowlist: ${normalizeRel(root, resolvedDir)}`)
    return { status, content: null }
  }

  const relDir = normalizeRel(root, dirPath)
  const cacheKey = `${dirPath}:${(await fs.stat(path.join(dirPath, WM_FILE)).catch(() => ({ mtimeMs: 0 }))).mtimeMs}`
  
  if (validationCache.has(cacheKey)) {
    const cached = validationCache.get(cacheKey)
    if (Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.result
    }
  }

  const status = createStatus()
  const wmPath = path.join(dirPath, WM_FILE)

  let content
  try {
    content = await fs.readFile(wmPath, "utf8")
  } catch (error) {
    addIssue(status, "missing", relDir, ["WM.md missing"])
    addAction(status, `/wm-init ${relDir}`)
    addAction(status, "@wm-steward")
    const result = { status, content: null }
    validationCache.set(cacheKey, { timestamp: Date.now(), result })
    return result
  }

  const parsed = parseCommentary(content)
  if (parsed.missingBlock) {
    addIssue(status, "missing", relDir, ["<directory-commentary> missing"])
    addAction(status, `/wm-sync ${relDir}`)
    addAction(status, "@wm-steward")
    const result = { status, content }
    validationCache.set(cacheKey, { timestamp: Date.now(), result })
    return result
  }

  const { files, dirs, error } = await listDirectory(dirPath)
  if (error) {
    // If listing failed, we can't validate contents. Block reads to keep invariants.
    addIssue(status, "missing", relDir, ["Unable to list directory"])
    status.notes.push(`Unable to list directory: ${error.message}`)
    addAction(status, "@wm-steward")
    const result = { status, content }
    validationCache.set(cacheKey, { timestamp: Date.now(), result })
    return result
  }

  const actualItems = new Set([...files, ...dirs])
  const commentaryItems = new Set([...parsed.fileEntries.keys(), ...parsed.subdirEntries.keys()])

  const missingItems = [...actualItems].filter((item) => !commentaryItems.has(item))
  const extraItems = [...commentaryItems].filter((item) => !actualItems.has(item))

  const staleItems = []
  for (const [entryPath, text] of parsed.fileEntries.entries()) {
    if (countWords(text) < MIN_WORDS) {
      staleItems.push(entryPath)
    }
  }
  for (const [entryPath, text] of parsed.subdirEntries.entries()) {
    if (countWords(text) < MIN_WORDS) {
      staleItems.push(entryPath)
    }
  }

  addIssue(status, "missing", relDir, missingItems)
  addIssue(status, "extra", relDir, extraItems)
  addIssue(status, "stale", relDir, staleItems)

  if (actualItems.size > 10 && !parsed.hasException) {
    addIssue(status, "over_limit", relDir, [`${actualItems.size} items`])
    addAction(status, `/wm-sync ${relDir}`)
    addAction(status, "@wm-steward")
  }

  if (missingItems.length || extraItems.length || staleItems.length) {
    addAction(status, `/wm-sync ${relDir}`)
    addAction(status, "@wm-steward")
  }

  const result = { status, content }
  validationCache.set(cacheKey, { timestamp: Date.now(), result })
  return result
}

const buildChain = (root, targetDir) => {
  const rel = path.relative(root, targetDir)
  if (rel.startsWith("..")) {
    return null
  }

  const segments = rel ? rel.split(path.sep) : []
  const chain = [root]
  let current = root
  for (const segment of segments) {
    if (!segment || segment === ".") {
      continue
    }
    current = path.join(current, segment)
    chain.push(current)
  }
  return chain
}

const mergeStatus = (base, next) => {
  for (const key of Object.keys(base)) {
    if (Array.isArray(next[key]) && next[key].length) {
      base[key].push(...next[key])
    }
  }
}

const hasBlockingIssues = (status) => {
  return status.missing.length > 0 || status.extra.length > 0 || status.stale.length > 0 || status.over_limit.length > 0
}

const extractPathsFromOutput = (root, output, mode) => {
  if (!output) {
    return []
  }

  const paths = new Set()
  const rawOutput = typeof output === "string" ? output : output.output

  if (output && Array.isArray(output.files)) {
    for (const file of output.files) {
      const resolved = path.isAbsolute(file) ? file : path.join(root, file)
      paths.add(path.normalize(resolved))
    }
  }

  if (output && Array.isArray(output.matches)) {
    for (const match of output.matches) {
      if (typeof match === "string") {
        const resolved = path.isAbsolute(match) ? match : path.join(root, match)
        paths.add(path.normalize(resolved))
      } else if (match?.file || match?.path) {
        const raw = match.file || match.path
        const resolved = path.isAbsolute(raw) ? raw : path.join(root, raw)
        paths.add(path.normalize(resolved))
      }
    }
  }

  if (!rawOutput) {
    return [...paths]
  }

  const lines = rawOutput.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
  for (const line of lines) {
    if (line.startsWith("WM-STATUS") || line.startsWith("-") || line.startsWith("---")) {
      continue
    }

    let candidate = ""
    if (mode === "grep") {
      if (line.endsWith(":")) {
        candidate = line.slice(0, -1)
      } else {
        const colonIndex = line.indexOf(":")
        if (colonIndex > 0) {
          candidate = line.slice(0, colonIndex)
        }
      }

      if (!candidate || !(/[\\/]/.test(candidate) || candidate.startsWith("."))) {
        continue
      }
    } else {
      candidate = line
    }

    if (!candidate) {
      continue
    }

    const resolved = path.isAbsolute(candidate) ? candidate : path.join(root, candidate)
    paths.add(path.normalize(resolved))
  }

  return [...paths]
}

const resolveListTargets = async (root, targets) => {
  const list = Array.isArray(targets) && targets.length ? targets : ["."]
  const resolved = await Promise.all(
    list.map(async (target) => {
      const full = path.isAbsolute(target) ? target : path.join(root, target)
      try {
        const stats = await fs.stat(full)
        if (stats.isDirectory()) {
          return full
        }
        return path.dirname(full)
      } catch {
        return path.dirname(full)
      }
    }),
  )
  return [...new Set(resolved.map((item) => path.normalize(item)))]
}

export const WMGuard = async ({ directory, worktree, client }) => {
  const root = path.resolve(worktree || directory)

  return {
    "command.execute.before": async (input) => {
      if (input.command === "wm-mv" || input.command === "wm-rm") {
        allowBashBySession.set(input.sessionID, {
          expires: Date.now() + 15000,
          op: input.command === "wm-mv" ? "mv" : "rm",
        })
      }
    },
    "tool.execute.before": async (input, output) => {
      if (input.tool === "edit" || input.tool === "write") {
        const target = output.args?.filePath || output.args?.path
        if (target) {
          const resolved = path.isAbsolute(target) ? target : path.join(root, target)
          const state = await loadState()
          const config = state?.config ?? {}
          const readOnlyRoots = normalizeRoots(config.readOnlyRoots)
          if (matchesRoots(resolved, readOnlyRoots)) {
            const entry = {
              ts: Date.now(),
              tool: input.tool,
              phase: "before",
              action: "edit",
              target: resolved,
              result: "blocked",
              reason: "read-only exception",
            }
            await logTelemetry(state, entry)
            throw new Error("WM-GUARD: Read-only exception. Edits are blocked for allowlisted external directories.")
          }
        }
      }

      if (input.tool === "bash") {
        const command = String(output.args?.command || "")
        const match = /^\s*(?:git\s+)?(rm|mv)\b/.exec(command)
        if (match) {
          const allowed = allowBashBySession.get(input.sessionID)
          if (!allowed || allowed.expires < Date.now()) {
            const state = await loadState()
            await logTelemetry(state, {
              ts: Date.now(),
              tool: "bash",
              phase: "before",
              action: match[1],
              result: "blocked",
              reason: "wrapper required",
            })
            throw new Error("WM-GUARD: Use /wm-mv or /wm-rm for move/remove operations so WM.md stays in sync.")
          }
          if (allowed.op !== match[1]) {
            allowBashBySession.delete(input.sessionID)
            const state = await loadState()
            await logTelemetry(state, {
              ts: Date.now(),
              tool: "bash",
              phase: "before",
              action: match[1],
              result: "blocked",
              reason: "wrapper mismatch",
            })
            throw new Error("WM-GUARD: Move/remove type does not match the active wrapper command.")
          }
          allowBashBySession.delete(input.sessionID)
          return
        }

        if (/^\s*ls\b/.test(command)) {
          const tokens = command.split(/\s+/).filter(Boolean)
          const args = tokens.slice(1)
          const paths = []
          let inPaths = false

          for (const token of args) {
            if (token === "--") {
              inPaths = true
              continue
            }
            if (!inPaths && token.startsWith("-")) {
              continue
            }
            paths.push(token)
          }

          callState.set(input.callID, {
            tool: "bash-ls",
            paths,
          })
        }
        return
      }

      if (input.tool === "read") {
        const filePath = output.args?.filePath
        if (!filePath) {
          return
        }

        const resolved = path.isAbsolute(filePath) ? filePath : path.join(root, filePath)
        const isWMRead = path.basename(resolved) === WM_FILE
        const state = await loadState()
        const config = state?.config ?? {}
        const allowRoots = normalizeRoots(config.externalAllowRoots)
        const isOutside = !isUnderRoot(resolved, root)

        if (isOutside) {
          if (!matchesRoots(resolved, allowRoots)) {
            await logTelemetry(state, {
              ts: Date.now(),
              tool: "read",
              phase: "before",
              action: "read",
              target: resolved,
              result: "blocked",
              reason: "outside root",
            })
            throw new Error("WM-GUARD: Read blocked. Target path is outside the project root.")
          }
          const status = createStatus()
          status.notes.push("external allowlist: WM chain skipped")
          callState.set(input.callID, {
            tool: "read",
            chain: [],
            status,
            skipLastChain: isWMRead,
            skipChain: true,
            targetPath: resolved,
            external: true,
          })
          return
        }

        const targetDir = path.dirname(resolved)
        const chain = buildChain(root, targetDir)
        if (!chain) {
          await logTelemetry(state, {
            ts: Date.now(),
            tool: "read",
            phase: "before",
            action: "read",
            target: resolved,
            result: "blocked",
            reason: "chain build failed",
          })
          throw new Error("WM-GUARD: Read blocked. Target path is outside the project root.")
        }

        const status = createStatus()
        const chainContent = []

        const validations = chain.map((dirPath) => validateDirectory(root, dirPath, { externalAllowRoots: allowRoots }))
        const results = await Promise.all(validations)

        for (let i = 0; i < results.length; i++) {
          const result = results[i]
          const dirPath = chain[i]
          mergeStatus(status, result.status)
          if (result.content) {
            chainContent.push({ dir: dirPath, content: result.content })
          }
        }

        if (hasBlockingIssues(status)) {
          addAction(status, "@wm-steward")
          await logTelemetry(state, {
            ts: Date.now(),
            tool: "read",
            phase: "before",
            action: "read",
            target: resolved,
            result: "blocked",
            status: summarizeStatus(status),
            reason: "wm validation",
          })
          const message = `WM-GUARD: Read blocked.\n${formatStatus(status)}`
          throw new Error(message)
        }

        let skipChain = false
        const sleepEnabled = config.sleepEnabled !== false
        const sleepSkips = Number.isFinite(config.sleepTriggerCount)
          ? Math.max(0, config.sleepTriggerCount)
          : 0

        if (sleepEnabled && sleepSkips > 0) {
          const key = path.normalize(targetDir)
          const entry = state.sleep?.[key] ?? {
            remainingSkips: 0,
            lastRead: 0,
            totalTriggers: 0,
          }

          if (entry.remainingSkips > 0) {
            skipChain = true
            entry.remainingSkips -= 1
          } else {
            entry.remainingSkips = sleepSkips
            entry.totalTriggers = (entry.totalTriggers || 0) + 1
          }

          entry.lastRead = Date.now()
          if (!state.sleep) {
            state.sleep = {}
          }
          state.sleep[key] = entry
          await saveState(state)
        }

        callState.set(input.callID, {
          tool: "read",
          chain: chainContent,
          status,
          skipLastChain: isWMRead,
          skipChain,
          targetPath: resolved,
          external: false,
        })
        return
      }

      if (input.tool === "list" || input.tool === "glob" || input.tool === "grep") {
        callState.set(input.callID, {
          tool: input.tool,
          args: output.args,
        })
      }
    },
    "tool.execute.after": async (input, output) => {
      const state = callState.get(input.callID)
      if (!state) {
        return
      }

      if (input.tool === "read" && state.tool === "read") {
        const shouldIncludeChain = !state.skipChain
        const chainForOutput = shouldIncludeChain
          ? state.skipLastChain
            ? state.chain.slice(0, -1)
            : state.chain
          : []
        const chainText = chainForOutput.length ? `${formatChain(root, chainForOutput)}\n\n` : ""
        const prefix = `${chainText}${formatStatus(state.status)}`
        output.output = `${prefix}\n\n${output.output}`
        const logState = await loadState()
        await logTelemetry(logState, {
          ts: Date.now(),
          tool: "read",
          phase: "after",
          action: "read",
          target: state.targetPath,
          result: "allowed",
          external: state.external,
          skipChain: state.skipChain,
          status: summarizeStatus(state.status),
        })
        callState.delete(input.callID)
        return
      }

      if (input.tool === "bash" && state.tool === "bash-ls") {
        const logState = await loadState()
        const allowRoots = normalizeRoots(logState?.config?.externalAllowRoots)
        const targets = await resolveListTargets(root, state.paths)
        const status = createStatus()
        const results = await Promise.all(targets.map((dirPath) => validateDirectory(root, dirPath, { externalAllowRoots: allowRoots })))
        for (const result of results) {
          mergeStatus(status, result.status)
        }
        output.output = `${formatStatus(status)}\n\n${output.output}`
        await logTelemetry(logState, {
          ts: Date.now(),
          tool: "bash",
          phase: "after",
          action: "ls",
          targets,
          result: "allowed",
          status: summarizeStatus(status),
        })
        callState.delete(input.callID)
        return
      }

      if (input.tool === "list") {
        const logState = await loadState()
        const allowRoots = normalizeRoots(logState?.config?.externalAllowRoots)
        const args = state.args || {}
        const dirPath = path.isAbsolute(args.path || "")
          ? args.path
          : path.join(root, args.path || "")
        const result = await validateDirectory(root, dirPath, { externalAllowRoots: allowRoots })
        output.output = `${formatStatus(result.status)}\n\n${output.output}`
        await logTelemetry(logState, {
          ts: Date.now(),
          tool: "list",
          phase: "after",
          action: "list",
          target: dirPath,
          result: "allowed",
          status: summarizeStatus(result.status),
        })
        callState.delete(input.callID)
        return
      }

      if (input.tool === "glob" || input.tool === "grep") {
        const logState = await loadState()
        const allowRoots = normalizeRoots(logState?.config?.externalAllowRoots)
        const mode = input.tool
        const matchedFiles = extractPathsFromOutput(root, output, mode)
        const status = createStatus()
        if (matchedFiles.length === 0) {
          status.notes.push("no matches or unable to parse results")
        } else {
          const dirs = [...new Set(matchedFiles.map((file) => path.dirname(file)))]
          for (const dirPath of dirs) {
            const result = await validateDirectory(root, dirPath, { externalAllowRoots: allowRoots })
            mergeStatus(status, result.status)
          }
        }
        output.output = `${formatStatus(status)}\n\n${output.output}`
        await logTelemetry(logState, {
          ts: Date.now(),
          tool: input.tool,
          phase: "after",
          action: "search",
          result: "allowed",
          matched: matchedFiles.length,
          status: summarizeStatus(status),
        })
        callState.delete(input.callID)
        return
      }

      callState.delete(input.callID)
    },
    event: async ({ event }) => {
      if (event.type === "file.edited" || event.type === "file.watcher.updated") {
        await client.app.log({
          service: "wm-guard",
          level: "info",
          message: "File change detected. Run /wm-sync for the affected directory.",
        })
      }

      if (event.type === "permission.updated" || event.type === "permission.replied") {
        await client.app.log({
          service: "wm-guard",
          level: "warn",
          message: "Permissions changed. Ensure WM enforcement remains active.",
        })
      }

      if (event.type === "session.idle") {
        await client.app.log({
          service: "wm-guard",
          level: "info",
          message: "Session idle. If WM-STATUS warnings exist, run /wm-sync.",
        })
      }
    },
    "experimental.session.compacting": async (_input, output) => {
      output.context.push(
        "WM POLICY: Reads append WM.md chain; list/glob/grep emit WM-STATUS only. If reads block, run /wm-init or /wm-sync and retry.",
      )
    },
  }
}
