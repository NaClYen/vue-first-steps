// 把 sessions/<場次>/index.md 轉成示範頁（大字、可用方向鍵逐段切換）。
// index.md 是唯一來源，不手寫 HTML、不做投影片。除了標準 Markdown，另有三個指令（各佔一行）：
//   @play steps/01 starter     該步 starter（或 solution）的 play.vuejs.org 連結
//   @play standalone           不加 starter／solution 時，直接用該資料夾（例如 S0 的檢查頁）
//   @diff steps/01             該步 starter → solution 的差異（自動產生）
//   @code steps/01/solution/App.vue   把檔案內容貼成程式碼區塊
// 另外，場次內若有 standalone/App.vue，會一併產生 check.html（單檔 HTML 備案，不需網路）
// 用法：node tools/build-pages.mjs [sessions 資料夾] [輸出資料夾]
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { Marked } from 'marked'
import { readTree } from './lib/fs.mjs'
import { assetsRoot, distRoot, sessionsRoot as defaultSessions, sharedRoot } from './lib/paths.mjs'
import { makeUrl } from './lib/playground.mjs'
import { buildStandalone } from './build-standalone.mjs'
import { stepDiff } from './step-diff.mjs'

const escapeHtml = (text) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const fence = (lang, code) => '```' + lang + '\n' + code.replace(/\n$/, '') + '\n```'
const languageByExtension = { '.vue': 'vue', '.js': 'js', '.ts': 'ts', '.json': 'json', '.html': 'html', '.css': 'css' }

export function expandDirectives(markdown, sessionDir) {
  return markdown
    .split('\n')
    .map((line) => {
      let match
      if ((match = /^@play\s+(\S+)(?:\s+(starter|solution))?\s*$/.exec(line))) {
        const url = makeUrl(readTree(path.join(sessionDir, match[1], match[2] ?? '')))
        const label = match[2] ? `（${match[2]}）` : ''
        return `<p class="play"><a href="${escapeHtml(url)}" target="_blank" rel="noopener">在 play.vuejs.org 開啟${label}</a></p>`
      }
      if ((match = /^@diff\s+(\S+)\s*$/.exec(line))) {
        return fence('diff', stepDiff(path.join(sessionDir, match[1])))
      }
      if ((match = /^@code\s+(\S+)\s*$/.exec(line))) {
        const file = path.join(sessionDir, match[1])
        return fence(languageByExtension[path.extname(file)] ?? '', readFileSync(file, 'utf8'))
      }
      if (line.startsWith('@play ') || line.startsWith('@diff ') || line.startsWith('@code ')) {
        throw new Error(`指令格式錯誤：${line}`)
      }
      return line
    })
    .join('\n')
}

export function renderPage(markdown, sessionDir) {
  const marked = new Marked({
    renderer: {
      code({ text, lang }) {
        const attr = lang ? ` data-lang="${escapeHtml(lang)}"` : ''
        return `<pre class="code"><code${attr}>${escapeHtml(text)}</code></pre>\n`
      },
    },
  })
  const body = marked.parse(expandDirectives(markdown, sessionDir))
  const title = /^#\s+(.+)$/m.exec(markdown)?.[1] ?? '示範頁'
  return `<!doctype html>
<html lang="zh-Hant">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <link rel="stylesheet" href="../../assets/guide.css" />
    <link rel="stylesheet" href="../../assets/demo.css" />
  </head>
  <body>
    <div class="page">
      <article class="doc demo">
${body}
      </article>
    </div>
    <script src="../../assets/highlight.min.js"></script>
    <script src="../../assets/guide.js"></script>
    <script src="../../assets/demo.js"></script>
  </body>
</html>
`
}

export async function buildPages(sessionsRoot, outDir) {
  const built = []
  mkdirSync(path.join(outDir, 'assets'), { recursive: true })
  const sharedDir = sharedRoot
  for (const name of readdirSync(sharedDir)) {
    if (name !== 'SOURCE.json') copyFileSync(path.join(sharedDir, name), path.join(outDir, 'assets', name))
  }
  for (const name of ['demo.css', 'demo.js']) {
    copyFileSync(path.join(assetsRoot, name), path.join(outDir, 'assets', name))
  }
  for (const session of readdirSync(sessionsRoot).sort()) {
    const sessionDir = path.join(sessionsRoot, session)
    const indexFile = path.join(sessionDir, 'index.md')
    if (!existsSync(indexFile)) continue
    const target = path.join(outDir, 'sessions', session, 'index.html')
    mkdirSync(path.dirname(target), { recursive: true })
    writeFileSync(target, renderPage(readFileSync(indexFile, 'utf8'), sessionDir))
    built.push(target)
    // 場次內若有 standalone/App.vue，另外產生不需要網路的單檔 HTML（check.html）
    const standalone = path.join(sessionDir, 'standalone/App.vue')
    if (existsSync(standalone)) {
      const html = path.join(path.dirname(target), 'check.html')
      writeFileSync(html, await buildStandalone(standalone, '單檔 HTML 檢查'))
      built.push(html)
    }
  }
  return built
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const sessionsRoot = path.resolve(process.argv[2] ?? defaultSessions)
  const outDir = path.resolve(process.argv[3] ?? distRoot)
  for (const file of await buildPages(sessionsRoot, outDir)) console.log(`寫入 ${path.relative(process.cwd(), file)}`)
}
