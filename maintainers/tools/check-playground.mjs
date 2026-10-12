// 用真的瀏覽器開產生的 play.vuejs.org 連結，確認預覽畫面長得對。
// play.vuejs.org 的網址格式沒有官方文件；格式一改，這個檢查就會紅燈（每週排程跑，見 .github/workflows/playground.yml）。
// 用法：node tools/check-playground.mjs
import { launch } from './lib/browser.mjs'
import { VUE_VERSION, makeUrl } from './lib/playground.mjs'

// 同時核對：預覽能跑、按鈕有反應、站上載入的 Vue 版本仍是 VUE_VERSION
const app = `<script setup>
import { ref, version } from 'vue'
const count = ref(0)
</script>

<template>
  <p class="version">vue {{ version }}</p>
  <button @click="count++">count: {{ count }}</button>
</template>
`
const url = makeUrl({ 'App.vue': app })

const browser = await launch()
let failed = false
try {
  const page = await browser.newPage()
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  // 預覽在 iframe 內；點按鈕後數字要變，代表程式真的跑起來
  const preview = page.frameLocator('iframe').first()
  const version = await preview.locator('.version').innerText({ timeout: 60_000 })
  if (version !== `vue ${VUE_VERSION}`) {
    throw new Error(`play.vuejs.org 現在載入的是「${version}」，與固定版本 ${VUE_VERSION} 不同`)
  }
  const button = preview.getByRole('button', { name: /^count: 0$/ })
  await button.click()
  await preview.getByRole('button', { name: /^count: 1$/ }).waitFor({ timeout: 10_000 })
  console.log(`✓ play.vuejs.org 連結可用（${url.length} 字元）`)
} catch (error) {
  failed = true
  console.error(`✗ play.vuejs.org 連結檢查失敗：${error.message}`)
  console.error(`  連結：${url.slice(0, 200)}...`)
} finally {
  await browser.close()
}
process.exit(failed ? 1 : 0)
