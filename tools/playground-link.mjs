// 用法：
//   node tools/playground-link.mjs <資料夾>          印出該資料夾所有檔案的 play.vuejs.org 連結
//   node tools/playground-link.mjs --decode <連結>   把連結解回檔案，印成 JSON
import { pathToFileURL } from 'node:url'
import { readTree } from './lib/fs.mjs'
import { makeUrl, parseUrl } from './lib/playground.mjs'

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [first, second] = process.argv.slice(2)
  if (first === '--decode' && second) {
    console.log(JSON.stringify(parseUrl(second), null, 2))
  } else if (first) {
    console.log(makeUrl(readTree(first)))
  } else {
    console.error('用法：playground-link.mjs <資料夾> | --decode <連結>')
    process.exit(1)
  }
}
