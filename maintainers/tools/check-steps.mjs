// 每一步必須通過的檢查（vitest 另外跑，見 npm test）：
//   1. 所有 .vue 檔都能用 @vue/compiler-sfc 編譯
//   2. 產生的 play.vuejs.org 連結能解回原檔（來回一致）
//   3. 每個起始專案 = 上一步的解答（第一步除外）；差異只能是 @task 題目註解
//   4. 每一步都有 solution 與 test
// 用法：node tools/check-steps.mjs [sessions 資料夾]
import { existsSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { listSteps, readTree } from './lib/fs.mjs'
import { sessionsRoot } from './lib/paths.mjs'
import { hasTaskMarker, stripTaskTree } from './lib/tasks.mjs'
import { decodeHash, encodeFiles } from './lib/playground.mjs'
import { compileSfc } from './lib/sfc.mjs'

const defaultRoot = sessionsRoot

export function checkSteps(sessionsRoot) {
  const problems = []
  const steps = listSteps(sessionsRoot)
  const bySession = new Map()
  for (const step of steps) {
    if (!bySession.has(step.session)) bySession.set(step.session, [])
    bySession.get(step.session).push(step)
  }

  for (const [session, list] of bySession) {
    let previousSolution = null
    for (const step of list) {
      const label = `${session}/steps/${step.step}`
      for (const part of ['solution', 'test']) {
        if (!existsSync(step[part])) problems.push(`${label}: 缺少 ${part}/`)
      }
      if (!existsSync(step.solution)) {
        previousSolution = null
        continue
      }
      const starter = existsSync(step.starter) ? readTree(step.starter) : {}
      const solution = readTree(step.solution)

      for (const [name, source] of Object.entries(solution)) {
        if (hasTaskMarker(source)) problems.push(`${label}/solution/${name}: solution 不可含 @task 標記`)
      }

      for (const [kind, files] of [['starter', starter], ['solution', solution]]) {
        for (const [name, source] of Object.entries(files)) {
          if (name.endsWith('.vue')) {
            problems.push(...compileSfc(source, `${label}/${kind}/${name}`).errors)
          }
        }
        // 連結來回一致
        const roundTrip = decodeHash(encodeFiles(files))
        if (JSON.stringify(roundTrip) !== JSON.stringify(files)) {
          problems.push(`${label}/${kind}: play.vuejs.org 連結解回的內容與原檔不同`)
        }
      }

      if (previousSolution) {
        // 唯一允許的差異是 @task-start／@task-end 夾住的題目註解
        const same =
          JSON.stringify(stripTaskTree(starter)) === JSON.stringify(previousSolution.files)
        if (!same) {
          problems.push(
            `${label}: starter 與上一步（${previousSolution.step}）的 solution 不同`,
          )
        }
      }
      previousSolution = { step: step.step, files: solution }
    }
  }
  return { problems, stepCount: steps.length }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const root = path.resolve(process.argv[2] ?? defaultRoot)
  const { problems, stepCount } = checkSteps(root)
  if (problems.length) {
    console.error(problems.map((p) => `✗ ${p}`).join('\n'))
    console.error(`\n${problems.length} 個問題（共檢查 ${stepCount} 步）`)
    process.exit(1)
  }
  console.log(`✓ ${stepCount} 步全部通過`)
}
