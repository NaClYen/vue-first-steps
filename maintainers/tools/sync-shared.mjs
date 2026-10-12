// 從本機的 react-to-vue clone 複製共用資源到 shared/，並記錄來源版本與雜湊。
// 用法：node tools/sync-shared.mjs <react-to-vue 路徑> [--ref <標記或 commit>]
// 指定 --ref（標記或 commit）時，檔案直接從該版本取出，不看工作目錄；沒指定時用 HEAD。
// 來源有標記版本時，請務必指定標記（PLAN：連結指向標記版本，不指向 main）。
import { execFileSync, spawnSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { sha256 } from './lib/hash.mjs'
import { sharedRoot } from './lib/paths.mjs'

const sharedDir = sharedRoot
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
const ref = refIndex >= 0 ? args[refIndex + 1] : 'HEAD'
const resolved = git('rev-parse', '--verify', `${ref}^{commit}`)
if (resolved.status !== 0) {
  console.error(`找不到版本 ${ref}（先在 react-to-vue 執行 git fetch --tags）`)
  process.exit(1)
}
const commit = resolved.stdout.trim()

mkdirSync(sharedDir, { recursive: true })
const files = {}
for (const [from, to] of Object.entries(FILES)) {
  const content = execFileSync('git', ['-C', source, 'show', `${commit}:${from}`], { maxBuffer: 1 << 26 })
  writeFileSync(path.join(sharedDir, to), content)
  files[to] = { from, sha256: sha256(content) }
}
writeFileSync(
  path.join(sharedDir, 'SOURCE.json'),
  JSON.stringify({ repo: 'https://github.com/NaClYen/react-to-vue', ref, commit, files }, null, 2) + '\n',
)
console.log(`已從 ${ref}（${commit.slice(0, 7)}）複製 ${Object.keys(files).length} 個檔案`)
