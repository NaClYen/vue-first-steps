import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'

export const posix = (value) => value.split(path.sep).join('/')

// 讀一個資料夾（含子資料夾）成 { 相對路徑: 內容 }，路徑用 /，依名稱排序
export function readTree(dir) {
  const files = {}
  const walk = (current) => {
    for (const name of readdirSync(current).sort()) {
      const full = path.join(current, name)
      if (statSync(full).isDirectory()) walk(full)
      else files[posix(path.relative(dir, full))] = readFileSync(full, 'utf8')
    }
  }
  walk(dir)
  return files
}

// sessions/<場次>/steps/<NN>/{starter,solution,test}
export function listSteps(sessionsRoot) {
  const result = []
  for (const session of readdirSync(sessionsRoot).sort()) {
    const stepsDir = path.join(sessionsRoot, session, 'steps')
    try {
      if (!statSync(stepsDir).isDirectory()) continue
    } catch {
      continue
    }
    for (const step of readdirSync(stepsDir).sort()) {
      const dir = path.join(stepsDir, step)
      if (!statSync(dir).isDirectory()) continue
      result.push({
        session,
        step,
        dir,
        starter: path.join(dir, 'starter'),
        solution: path.join(dir, 'solution'),
        test: path.join(dir, 'test'),
      })
    }
  }
  return result
}
