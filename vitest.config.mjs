import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    include: [
      'tools/**/*.test.mjs',
      // 每一步的測試（同時是學員的自我檢查）；fixtures 也跑，確保測試流程本身沒壞
      'sessions/**/test/*.test.js',
      'tools/test-fixtures/**/test/*.test.js',
    ],
  },
})
