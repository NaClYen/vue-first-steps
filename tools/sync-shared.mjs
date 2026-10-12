// 從本機的 react-to-vue clone 複製共用資源到 shared/，並記錄來源版本與雜湊。
// 用法：node tools/sync-shared.mjs <react-to-vue 路徑> [--ref <標記或 commit>]
// 沒有指定 --ref 時，記錄該 clone 目前的 HEAD commit。若來源有標記版本，請務必指定標記。
import { spawnSync } from 'node:child_process'
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { sha256 } from './lib/hash.mjs'

const repoRoot = fileURLToPath(new URL('..', import.meta.url))
const sharedDir = path.join(repoRoot, 'shared')
// 來源路徑（相對於 react-to-vue）→ shared/ 內的檔名
const FILES = {
  'docs/assets/guide.css': 'guide.css',
  'docs/assets/guide.js': 'guide.js',
  'docs/assets/highlight.min.js': 'highlight.min.js',
  'docs/assets/highlight.LICENSE.txt': 'highlight.LICENSE.txt',
}

const args = process.argv.slice(2)
const source = args.find((a) => !a.startsWith('--'))
const refIndex = args.indexOf('--ref')
if (!source) {
  console.error('用法：sync-shared.mjs <react-to-vue 路徑> [--ref <標記或 commit>]')
  process.exit(1)
}
const git = (...a) => spawnSync('git', ['-C', source, ...a], { encoding: 'utf8' })
const commit = git('rev-parse', 'HEAD').stdout.trim()
const ref = refIndex >= 0 ? args[refIndex + 1] : commit

mkdirSync(sharedDir, { recursive: true })
const files = {}
for (const [from, to] of Object.entries(FILES)) {
  copyFileSync(path.join(source, from), path.join(sharedDir, to))
  files[to] = { from, sha256: sha256(readFileSync(path.join(sharedDir, to))) }
}
writeFileSync(
  path.join(sharedDir, 'SOURCE.json'),
  JSON.stringify({ repo: 'https://github.com/NaClYen/react-to-vue', ref, commit, files }, null, 2) + '\n',
)
console.log(`已從 ${ref}（${commit.slice(0, 7)}）複製 ${Object.keys(files).length} 個檔案`)
