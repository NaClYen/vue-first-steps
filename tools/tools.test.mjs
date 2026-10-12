// @vitest-environment node
// 維護工具自己的測試：連結來回、步驟檢查能抓到壞掉的步驟、共用資源雜湊、示範頁產生。
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, test } from 'vitest'
import { buildPages } from './build-pages.mjs'
import { checkShared } from './check-shared.mjs'
import { checkSteps } from './check-steps.mjs'
import { decodeHash, encodeFiles, makeUrl, parseUrl } from './lib/playground.mjs'
import { diffTrees, stepDiff } from './step-diff.mjs'

const here = fileURLToPath(new URL('.', import.meta.url))
const fixtures = path.join(here, 'test-fixtures/sessions')
const temps = []
const temp = () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'vfs-'))
  temps.push(dir)
  return dir
}
afterEach(() => temps.splice(0).forEach((d) => rmSync(d, { recursive: true, force: true })))
const copyFixtures = () => {
  const dir = temp()
  cpSync(fixtures, dir, { recursive: true })
  return dir
}

describe('play.vuejs.org 連結', () => {
  const files = { 'App.vue': '<template>{{ "中文 😀" }}</template>\n', 'a/b.js': 'export {}' }
  test('編碼後解碼得到原檔（含中文與 emoji）', () => {
    expect(decodeHash(encodeFiles(files))).toEqual(files)
  })
  test('完整網址解回原檔', () => {
    const url = makeUrl(files)
    expect(url.startsWith('https://play.vuejs.org/#')).toBe(true)
    expect(parseUrl(url).files).toEqual(files)
  })
  test('能解舊格式（未壓縮的 base64 JSON）', () => {
    const legacy = Buffer.from(JSON.stringify(files)).toString('base64')
    expect(decodeHash(`#${legacy}`)).toEqual(files)
  })
  test('空的 hash 會丟錯', () => {
    expect(() => decodeHash('#')).toThrow()
  })
})

describe('check-steps', () => {
  test('範例場次全部通過', () => {
    expect(checkSteps(fixtures).problems).toEqual([])
  })
  test('starter 不等於上一步 solution 會被抓到', () => {
    const root = copyFixtures()
    writeFileSync(path.join(root, '00-sample/steps/02/starter/App.vue'), '<template>x</template>')
    const { problems } = checkSteps(root)
    expect(problems.join('\n')).toMatch(/starter 與上一步（01）的 solution 不同/)
  })
  test('壞掉的 .vue 會被抓到', () => {
    const root = copyFixtures()
    const file = path.join(root, '00-sample/steps/01/solution/App.vue')
    writeFileSync(file, '<template><div></template>')
    expect(checkSteps(root).problems.length).toBeGreaterThan(0)
  })
  test('缺少 test 會被抓到', () => {
    const root = copyFixtures()
    rmSync(path.join(root, '00-sample/steps/02/test'), { recursive: true })
    expect(checkSteps(root).problems.join('\n')).toMatch(/缺少 test/)
  })
})

describe('step-diff', () => {
  test('沒有差異時為空字串', () => {
    expect(diffTrees({ 'a.vue': 'x\n' }, { 'a.vue': 'x\n' })).toBe('')
  })
  test('由 starter 與 solution 自動產生差異', () => {
    const diff = stepDiff(path.join(fixtures, '00-sample/steps/01'))
    expect(diff).toContain('-  <button>count: {{ count }}</button>')
    expect(diff).toContain('+  <button @click="count++">count: {{ count }}</button>')
  })
})

describe('check-shared', () => {
  const sharedDir = path.join(here, '../shared')
  test('目前的 shared/ 與來源記錄相符', () => {
    expect(checkShared(sharedDir)).toEqual([])
  })
  test('偷改共用資源會被抓到', () => {
    const dir = temp()
    cpSync(sharedDir, dir, { recursive: true })
    writeFileSync(path.join(dir, 'guide.css'), '/* 改過 */')
    expect(checkShared(dir).join('\n')).toMatch(/guide\.css: 雜湊與 SOURCE\.json 不符/)
  })
})

describe('build-pages', () => {
  test('產生示範頁，指令被展開', () => {
    const out = temp()
    const [page] = buildPages(fixtures, out)
    const html = readFileSync(page, 'utf8')
    expect(html).toContain('<title>範例場次</title>')
    expect(html).toContain('https://play.vuejs.org/#')
    expect(html).toContain('data-lang="diff"')
    expect(html).toContain('data-lang="vue"')
    expect(html).not.toMatch(/^@(play|diff|code)/m)
    expect(readFileSync(path.join(out, 'assets/guide.css'), 'utf8').length).toBeGreaterThan(1000)
  })
})
