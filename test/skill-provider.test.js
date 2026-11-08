import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { apply, inject, name } from '../index.js'
import { SKILL_CANDIDATE, SKILL_DESCRIPTION, skillProvider, stripFrontmatter } from '../skill-provider.js'

const skillMarkdown = await readFile(new URL('../skills/agentswarm-work/SKILL.md', import.meta.url), 'utf8')
const frontmatter = /^---\n([\s\S]*?)\n---\n/.exec(skillMarkdown)[1]
const field = key => new RegExp(`^${key}: (.*)$`, 'm').exec(frontmatter)?.[1]

test('candidate mirrors the SKILL.md frontmatter', () => {
  assert.equal(SKILL_CANDIDATE.name, field('name'))
  assert.equal(SKILL_DESCRIPTION, field('description'))
  assert.equal(field('disable-model-invocation'), 'true')
  assert.deepEqual(SKILL_CANDIDATE.invocation, { modelInvocable: false, userInvocable: true })
  assert.match(SKILL_CANDIDATE.name, /^[a-z0-9]+(?:-[a-z0-9]+)*$/)
})

test('get returns the body without frontmatter', async () => {
  const [candidate] = await skillProvider.list({})
  const definition = await skillProvider.get(candidate, {})
  assert.equal(definition.name, 'agentswarm-work')
  assert.ok(definition.content.startsWith('# Find useful work on agentswarm.space'))
  assert.ok(!definition.content.includes('disable-model-invocation'))
  assert.equal(definition.resourceBase.kind, 'directory')
})

test('stripFrontmatter leaves plain markdown unchanged', () => {
  assert.equal(stripFrontmatter('# Title\n'), '# Title\n')
})

test('apply registers exactly one provider on ctx.skills', () => {
  const registered = []
  apply({ skills: { registerProvider: create => registered.push(create({ signal: new AbortController().signal, invalidate() {} })) } })
  assert.equal(name, 'dsh-agentswarm')
  assert.deepEqual(inject, ['skills'])
  assert.deepEqual(registered, [skillProvider])
})
