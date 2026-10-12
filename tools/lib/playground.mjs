// play.vuejs.org 連結的編碼與解碼。
// 網址 # 之後是 base64(zlib(JSON.stringify({ 檔名: 內容 })))。這個格式沒有官方文件，
// 所以 check-playground 會每週用真的瀏覽器開產生的連結，網址格式變了就會紅燈。
import { deflateSync, inflateSync } from 'node:zlib'

export const VUE_VERSION = '3.5.43'
export const PLAYGROUND_ORIGIN = 'https://play.vuejs.org'

export function encodeFiles(files) {
  const json = JSON.stringify(files)
  return deflateSync(Buffer.from(json, 'utf8'), { level: 9 }).toString('base64')
}

export function decodeHash(hash) {
  const raw = hash.replace(/^#/, '')
  if (!raw) throw new Error('網址沒有 # 之後的內容')
  const bytes = Buffer.from(raw, 'base64')
  // 新格式是 zlib（開頭 0x78）；舊格式是未壓縮的 UTF-8 JSON
  const json = bytes[0] === 0x78 ? inflateSync(bytes) : bytes
  return JSON.parse(json.toString('utf8'))
}

// 注意：play.vuejs.org 的 ?vue=版本 參數實測無效（2026-10 以 3.4.0 試過，仍載入站上部署的版本）。
// 預設 Vue 來自 play.vuejs.org 自己的網域（不經第三方 CDN），版本是站上目前部署的版本；
// check-playground 每週核對它是否仍等於 VUE_VERSION。要硬性固定版本，得在 files 加
// import-map.json 指向 CDN，那需要公司網路能連 CDN，等 M1 實測後再決定。
export function makeUrl(files, { origin = PLAYGROUND_ORIGIN } = {}) {
  return `${origin}/#${encodeFiles(files)}`
}

export function parseUrl(url) {
  return { files: decodeHash(new URL(url).hash) }
}
