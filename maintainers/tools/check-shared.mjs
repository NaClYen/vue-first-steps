// 檢查 shared/ 內的檔案雜湊與 SOURCE.json 記錄一致（沒人偷改共用資源）。
// 用法：node tools/check-shared.mjs [shared 資料夾]
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { sha256 } from './lib/hash.mjs'
import { sharedRoot } from './lib/paths.mjs'

const defaultDir = sharedRoot

export function checkShared(dir) {
  const problems = []
  const sourceFile = path.join(dir, 'SOURCE.json')
  if (!existsSync(sourceFile)) return [`${dir}: 缺少 SOURCE.json`]
  const source = JSON.parse(readFileSync(sourceFile, 'utf8'))
  for (const [name, info] of Object.entries(source.files)) {
    const file = path.join(dir, name)
    if (!existsSync(file)) {
      problems.push(`shared/${name}: 檔案不存在`)
    } else if (sha256(readFileSync(file)) !== info.sha256) {
      problems.push(`shared/${name}: 雜湊與 SOURCE.json 不符（來源 ${source.ref}）。要改請回到 react-to-vue，再用 sync-shared 重新複製`)
    }
  }
  for (const name of readdirSync(dir)) {
    if (name !== 'SOURCE.json' && !(name in source.files)) {
      problems.push(`shared/${name}: 不在 SOURCE.json 內`)
    }
  }
  return problems
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const dir = path.resolve(process.argv[2] ?? defaultDir)
  const problems = checkShared(dir)
  if (problems.length) {
    console.error(problems.map((p) => `✗ ${p}`).join('\n'))
    process.exit(1)
  }
  console.log('✓ shared/ 雜湊全部相符')
}
