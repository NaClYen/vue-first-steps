// 把 sessions/<場次>/index.md 轉成示範頁（大字、可用方向鍵逐段切換）。
// index.md 是唯一來源，不手寫 HTML、不做投影片。除了標準 Markdown，另有三個指令（各佔一行）：
//   @play steps/01 starter     該步 starter（或 solution）的 play.vuejs.org 連結
//   @diff steps/01             該步 starter → solution 的差異（自動產生）
//   @code steps/01/solution/App.vue   把檔案內容貼成程式碼區塊
// 用法：node tools/build-pages.mjs [sessions 資料夾] [輸出資料夾]
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { Marked } from 'marked'
import { readTree } from './lib/fs.mjs'
import { makeUrl } from './lib/playground.mjs'
import { stepDiff } from './step-diff.mjs'

const repoRoot = fileURLToPath(new URL('..', import.meta.url))
const escapeHtml = (text) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const fence = (lang, code) => '```' + lang + '\n' + code.replace(/\n$/, '') + '\n```'
const languageByExtension = { '.vue': 'vue', '.js': 'js', '.ts': 'ts', '.json': 'json', '.html': 'html', '.css': 'css' }

export function expandDirectives(markdown, sessionDir) {
  return markdown
    .split('\n')
    .map((line) => {
      let match
      if ((match = /^@play\s+(\S+)\s+(starter|solution)\s*$/.exec(line))) {
        const url = makeUrl(readTree(path.join(sessionDir, match[1], match[2])))
        return `<p class="play"><a href="${escapeHtml(url)}" target="_blank" rel="noopener">在 play.vuejs.org 開啟（${match[2]}）</a></p>`
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

export function buildPages(sessionsRoot, outDir) {
  const built = []
  mkdirSync(path.join(outDir, 'assets'), { recursive: true })
  const sharedDir = path.join(repoRoot, 'shared')
  for (const name of readdirSync(sharedDir)) {
    if (name !== 'SOURCE.json') copyFileSync(path.join(sharedDir, name), path.join(outDir, 'assets', name))
  }
  for (const name of ['demo.css', 'demo.js']) {
    copyFileSync(path.join(repoRoot, 'tools/assets', name), path.join(outDir, 'assets', name))
  }
  for (const session of readdirSync(sessionsRoot).sort()) {
    const sessionDir = path.join(sessionsRoot, session)
    const indexFile = path.join(sessionDir, 'index.md')
    if (!existsSync(indexFile)) continue
    const target = path.join(outDir, 'sessions', session, 'index.html')
    mkdirSync(path.dirname(target), { recursive: true })
    writeFileSync(target, renderPage(readFileSync(indexFile, 'utf8'), sessionDir))
    built.push(target)
  }
  return built
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const sessionsRoot = path.resolve(process.argv[2] ?? path.join(repoRoot, 'sessions'))
  const outDir = path.resolve(process.argv[3] ?? path.join(repoRoot, 'dist'))
  for (const file of buildPages(sessionsRoot, outDir)) console.log(`寫入 ${path.relative(process.cwd(), file)}`)
}
