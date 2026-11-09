import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'

const packageUrl = new URL('../package.json', import.meta.url)
const indexUrl = new URL('../market/index.json', import.meta.url)
const pkg = JSON.parse(readFileSync(packageUrl, 'utf8'))
const index = JSON.parse(readFileSync(indexUrl, 'utf8'))
const version = index.plugins.find(plugin => plugin.name === pkg.name)?.versions
  .find(version => version.version === pkg.version)
if (!version || version.source.type !== 'npm') {
  throw new Error('The package version must have an npm source in market/index.json')
}
const registryTimes = JSON.parse(execFileSync('npm', [
  'view', pkg.name, 'time', '--json', '--registry=https://registry.npmjs.org',
], { encoding: 'utf8' }))
const times = Array.isArray(registryTimes) && registryTimes.length === 1
  ? registryTimes[0] : registryTimes
const publishedAt = times?.[pkg.version]
const timestamp = typeof publishedAt === 'string' ? Date.parse(publishedAt) / 1000 : NaN
if (!Number.isFinite(timestamp) || timestamp < 0 || timestamp >= 1e11) {
  throw new Error(`No valid npm publish time for ${pkg.name}@${pkg.version}; index was not changed`)
}
version.publishTimestamp = Math.floor(timestamp)
writeFileSync(indexUrl, JSON.stringify(index, null, 2) + '\n')
console.log(`Set ${pkg.name}@${pkg.version} publishTimestamp to ${version.publishTimestamp}`)
