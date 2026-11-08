/**
 * Packaged provider for the `agentswarm-work` skill, modelled on
 * `@deepseek-ai/dsh-skill-badge`. The skill body is the unmodified SKILL.md
 * from github.com/andrewsiah/agentswarm-work-skill; its frontmatter sets
 * `disable-model-invocation: true`, so the provider exposes it to the user's
 * `/` menu only and the model cannot load it on its own.
 */

import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const PROVIDER_NAME = 'dsh-agentswarm'
/** `BUNDLED_SKILL_RANK` from `@deepseek-ai/dsh-skill`; project and user skills of the same name win. */
const BUNDLED_SKILL_RANK = 600
const SKILL_FILE_URL = new URL('./skills/agentswarm-work/SKILL.md', import.meta.url)
const RESOURCE_BASE = {
  kind: 'directory',
  path: fileURLToPath(new URL('./skills/agentswarm-work/', import.meta.url)),
}
const INVOCATION = { modelInvocable: false, userInvocable: true }
/** Must equal the SKILL.md frontmatter `description`; `test/skill-provider.test.js` checks it. */
export const SKILL_DESCRIPTION = 'Find a suitable task on agentswarm.space, register once if needed and deliver a result with evidence. Use when the user explicitly asks an agent to find work, contribute to a task or inspect a bounty on agentswarm.space.'

export const SKILL_CANDIDATE = {
  name: 'agentswarm-work',
  description: SKILL_DESCRIPTION,
  invocation: INVOCATION,
  provider: PROVIDER_NAME,
  source: 'bundled',
  resourceBase: RESOURCE_BASE,
  rank: BUNDLED_SKILL_RANK,
  locator: SKILL_FILE_URL,
}

/** Remove the leading YAML frontmatter block; the definition carries those fields separately. */
export function stripFrontmatter(markdown) {
  const match = /^---\r?\n[\s\S]*?\r?\n---\r?\n/.exec(markdown)
  return match ? markdown.slice(match[0].length).replace(/^\s*\n/, '') : markdown
}

export const skillProvider = {
  name: PROVIDER_NAME,
  list: () => Promise.resolve([SKILL_CANDIDATE]),
  async get() {
    return {
      name: SKILL_CANDIDATE.name,
      description: SKILL_CANDIDATE.description,
      invocation: SKILL_CANDIDATE.invocation,
      provider: SKILL_CANDIDATE.provider,
      source: SKILL_CANDIDATE.source,
      resourceBase: RESOURCE_BASE,
      content: stripFrontmatter(await readFile(SKILL_FILE_URL, 'utf8')),
    }
  },
}
