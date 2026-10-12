import { existsSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { chromium } from 'playwright-core'

// 找預先安裝的 Chromium（PLAYWRIGHT_BROWSERS_PATH），找不到就交給 playwright 自己決定
function findChromium() {
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH
  if (!base || !existsSync(base)) return undefined
  const direct = path.join(base, 'chromium')
  if (existsSync(direct) && statSync(direct).isFile()) return direct
  for (const name of readdirSync(base)) {
    if (!name.startsWith('chromium-')) continue
    const exe = path.join(base, name, 'chrome-linux', 'chrome')
    if (existsSync(exe)) return exe
  }
  return undefined
}

export const launch = () => chromium.launch({ executablePath: findChromium() })
