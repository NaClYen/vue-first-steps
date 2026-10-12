// 每一步的差異由 starter → solution 自動產生，不手寫。
// 用法：
//   node tools/step-diff.mjs <sessions/NN-名稱/steps/NN>   印出該步的差異
//   node tools/step-diff.mjs --all [sessions 資料夾]       寫到 dist/diffs/<場次>/<步驟>.diff
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { createTwoFilesPatch } from 'diff'
import { listSteps, readTree } from './lib/fs.mjs'
import { existsSync } from 'node:fs'

export function diffTrees(before, after) {
  const names = [...new Set([...Object.keys(before), ...Object.keys(after)])].sort()
  const parts = []
  for (const name of names) {
    if (before[name] === after[name]) continue
    const patch = createTwoFilesPatch(
      `a/${name}`,
      `b/${name}`,
      before[name] ?? '',
      after[name] ?? '',
      '',
      '',
      { context: 3 },
    )
    parts.push(patch.replace(/^=+\n/, ''))
  }
  return parts.join('\n')
}

export function stepDiff(stepDir) {
  const starterDir = path.join(stepDir, 'starter')
  const before = existsSync(starterDir) ? readTree(starterDir) : {}
  return diffTrees(before, readTree(path.join(stepDir, 'solution')))
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [first, second] = process.argv.slice(2)
  if (first === '--all') {
    const root = path.resolve(second ?? fileURLToPath(new URL('../sessions', import.meta.url)))
    const out = fileURLToPath(new URL('../dist/diffs', import.meta.url))
    for (const step of listSteps(root)) {
      const target = path.join(out, step.session, `${step.step}.diff`)
      mkdirSync(path.dirname(target), { recursive: true })
      writeFileSync(target, stepDiff(step.dir))
      console.log(`寫入 ${path.relative(process.cwd(), target)}`)
    }
  } else if (first) {
    process.stdout.write(stepDiff(first))
  } else {
    console.error('用法：step-diff.mjs <步驟資料夾> | --all [sessions 資料夾]')
    process.exit(1)
  }
}
