// 用真的瀏覽器驗證單檔 HTML 備案：斷網（擋掉所有網路請求）下從 file:// 開啟，按鈕要能動。
// 用法：node tools/test-standalone.mjs
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildStandalone } from './build-standalone.mjs'
import { launch } from './lib/browser.mjs'

const fixture = fileURLToPath(new URL('./test-fixtures/sessions/00-sample/steps/02/solution/App.vue', import.meta.url))
const dir = mkdtempSync(path.join(tmpdir(), 'vfs-standalone-'))
const browser = await launch()
let failed = false
try {
  const file = path.join(dir, 'index.html')
  writeFileSync(file, await buildStandalone(fixture))
  const page = await browser.newPage()
  const blocked = []
  await page.route(/^https?:/, (route) => {
    blocked.push(route.request().url())
    return route.abort()
  })
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto(`file://${file}`)
  await page.getByRole('button', { name: /count: 0/ }).click()
  await page.getByRole('button', { name: /count: 1/ }).waitFor()
  await page.getByRole('button', { name: 'reset' }).click()
  await page.getByRole('button', { name: /count: 0/ }).waitFor()
  if (errors.length) throw new Error(`頁面錯誤：${errors.join('; ')}`)
  if (blocked.length) throw new Error(`單檔 HTML 不該連網，卻發出請求：${blocked.join(', ')}`)
  console.log('✓ 單檔 HTML 在斷網、file:// 下運作正常')
} catch (error) {
  failed = true
  console.error(`✗ ${error.message}`)
} finally {
  await browser.close()
  rmSync(dir, { recursive: true, force: true })
}
process.exit(failed ? 1 : 0)
