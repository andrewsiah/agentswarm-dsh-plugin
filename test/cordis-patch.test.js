import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'

const patch = await readFile(new URL('../cordis.patch.yml', import.meta.url), 'utf8')
const rows = patch.split(/^(?=\s+- id: )/m)

// With `true`, dsh-mcp-client rejects activation on the first failed connect and never retries;
// with `false`, DSH starts without the tools and the reconnect supervisor keeps trying.
test('an unreachable MCP endpoint at startup does not reject the bundle', () => {
  const mcpRow = rows.find(row => /^\s+- id: dsh-agentswarm-mcp$/m.test(row))
  assert.ok(mcpRow, 'dsh-agentswarm-mcp row exists')
  assert.match(mcpRow, /^\s+failOnStartupError: false$/m)
})
