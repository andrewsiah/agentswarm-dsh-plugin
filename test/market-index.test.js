import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { marketInstallTarget, parseMarketIndex } from '@deepseek-ai/dsh-plugin-market-index'

const readJson = async path => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'))
const pkg = await readJson('../package.json')
const index = await readJson('../market/index.json')
const locales = { en: (await readJson('../locale/en.json')).meta, zh: (await readJson('../locale/zh.json')).meta }

test('market entry matches the package manifest and locales', async () => {
  assert.equal(index.format, 1)
  const [plugin] = index.plugins
  assert.equal(plugin.name, pkg.name)
  assert.equal(plugin.author, pkg.author)
  assert.equal(plugin.homepage, pkg.homepage)
  assert.deepEqual(plugin.title, { en: locales.en.title, zh: locales.zh.title })
  assert.deepEqual(plugin.description, { en: locales.en.description, zh: locales.zh.description })
  assert.deepEqual(plugin['dist-tags'], { latest: pkg.version })
  assert.equal(plugin.versions.length, 1)
  assert.equal(plugin.versions[0].version, pkg.version)
  assert.deepEqual(plugin.versions[0].engines, { dsh: pkg.engines.dsh })
  const repositoryUrl = pkg.repository.url.replace(/^git\+/, '').replace(/\.git$/, '')
  assert.deepEqual(plugin.repository, { url: repositoryUrl })
  const { source } = plugin.versions[0]
  assert.equal(source.type, 'git')
  assert.equal(source.url, repositoryUrl)
  assert.match(source.commit, /^[0-9a-f]{40}$/)
  assert.deepEqual(await readFile(new URL('../market/icons/dsh-agentswarm.svg', import.meta.url)), await readFile(new URL('../icon.svg', import.meta.url)))
})

test('DSH accepts the index at its GitHub Pages URL and installs the pinned commit', () => {
  const parsed = parseMarketIndex(index, 'https://andrewsiah.github.io/agentswarm-dsh-plugin/index.json')
  const [plugin] = parsed.plugins
  assert.equal(plugin.icon, 'https://andrewsiah.github.io/agentswarm-dsh-plugin/icons/dsh-agentswarm.svg')
  const { commit } = index.plugins[0].versions[0].source
  assert.deepEqual(marketInstallTarget(plugin.name, plugin.versions[0]), { spec: `git+https://github.com/andrewsiah/agentswarm-dsh-plugin.git#${commit}` })
})

test('metadata never promises withdrawable earnings', () => {
  assert.match(locales.en.description, /cannot be cashed out/)
  assert.match(locales.zh.description, /无法提现/)
})
