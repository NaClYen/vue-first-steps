// 備案：把一個 App.vue 打包成單一 HTML（內嵌 vue.global.prod.js），可直接從 file:// 開，不需要 npm 或網路。
// 用法：node tools/build-standalone.mjs <App.vue 路徑> [輸出 html]
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { compileScript, parse } from '@vue/compiler-sfc'
import { build } from 'esbuild'

const repoRoot = fileURLToPath(new URL('..', import.meta.url))
const vueRuntime = path.join(repoRoot, 'node_modules/vue/dist/vue.global.prod.js')

export async function buildStandalone(vueFile, title = path.basename(path.dirname(vueFile))) {
  const source = readFileSync(vueFile, 'utf8')
  const { descriptor, errors } = parse(source, { filename: vueFile })
  if (errors.length) throw new Error(errors.map((e) => e.message).join('\n'))
  const script = compileScript(descriptor, { id: 'standalone', inlineTemplate: true })
  const lang = descriptor.scriptSetup?.lang ?? descriptor.script?.lang ?? 'js'
  const result = await build({
    stdin: { contents: script.content, loader: lang === 'ts' ? 'ts' : 'js', resolveDir: path.dirname(vueFile) },
    bundle: true,
    write: false,
    format: 'iife',
    globalName: '__App',
    // 'vue' 改指向頁面上已載入的全域 Vue
    plugins: [
      {
        name: 'vue-global',
        setup(b) {
          b.onResolve({ filter: /^vue$/ }, () => ({ path: 'vue', namespace: 'vue-global' }))
          b.onLoad({ filter: /.*/, namespace: 'vue-global' }, () => ({ contents: 'module.exports = Vue', loader: 'js' }))
        },
      },
    ],
  })
  const bundle = result.outputFiles[0].text.replaceAll('</script', '<\\/script')
  const runtime = readFileSync(vueRuntime, 'utf8').replaceAll('</script', '<\\/script')
  return `<!doctype html>
<html lang="zh-Hant">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
  </head>
  <body>
    <div id="app"></div>
    <script>${runtime}</script>
    <script>
${bundle}
      Vue.createApp(__App.default).mount('#app')
    </script>
  </body>
</html>
`
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [input, output] = process.argv.slice(2)
  if (!input) {
    console.error('用法：build-standalone.mjs <App.vue> [輸出 html]')
    process.exit(1)
  }
  const target = path.resolve(output ?? path.join(repoRoot, 'dist/standalone', path.basename(path.dirname(input)) + '.html'))
  mkdirSync(path.dirname(target), { recursive: true })
  writeFileSync(target, await buildStandalone(input))
  console.log(`寫入 ${path.relative(process.cwd(), target)}`)
}
