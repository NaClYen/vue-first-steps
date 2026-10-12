// 專案分兩邊：
//   輸出（交付給講師與學員）：sessions/、shared/、facilitator/、README.md，建置結果放 dist/
//   維護（只給維護者與 agent）：maintainers/（計畫、任務、工具、測試、相依套件）
import { fileURLToPath } from 'node:url'

const at = (relative) => fileURLToPath(new URL(relative, import.meta.url))

export const maintainersRoot = at('../../')
export const projectRoot = at('../../../')
export const sessionsRoot = at('../../../sessions')
export const sharedRoot = at('../../../shared')
export const distRoot = at('../../../dist')
export const assetsRoot = at('../assets')
