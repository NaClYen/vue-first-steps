import path from 'node:path'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

const here = path.dirname(fileURLToPath(import.meta.url))
const modules = path.join(here, 'node_modules')

// 專案根目錄當 root，sessions/ 內的步驟測試才讀得到；
// 相依套件只裝在 maintainers/，所以把 sessions/ 會用到的套件指到這裡。
export default defineConfig({
  root: path.join(here, '..'),
  plugins: [vue()],
  resolve: {
    alias: [
      { find: /^vue$/, replacement: path.join(modules, 'vue') },
      { find: /^@vue\/test-utils$/, replacement: path.join(modules, '@vue/test-utils') },
      { find: /^vitest$/, replacement: path.join(modules, 'vitest') },
    ],
  },
  test: {
    environment: 'jsdom',
    include: [
      'maintainers/tools/**/*.test.mjs',
      // 每一步的測試（同時是學員的自我檢查）；fixtures 也跑，確保測試流程本身沒壞
      'sessions/**/test/*.test.js',
      'maintainers/tools/test-fixtures/**/test/*.test.js',
    ],
  },
})
