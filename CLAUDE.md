# 專案規則

## Git commit

- commit 的作者使用使用者自己的 git 身分（`git config user.name` / `user.email`），不要掛 Claude。
- commit 訊息不加 `Co-Authored-By`、`Claude-Session` 等 Claude 署名。
- 若目前 git 身分是 Claude 預設值，改用此 repo 既有 commit 的人類作者。
- 直接在 `main` 開發。

## 結構：輸出與維護分開

| 位置 | 性質 | 內容 |
| --- | --- | --- |
| `sessions/` | 輸出（學員看得到） | 每場的示範頁原稿 `index.md` 與每一步的 `starter`／`solution`／`test` |
| `shared/` | 輸出 | 從 react-to-vue 標記版本複製的樣式與腳本；**不可手改**，雜湊記在 `SOURCE.json` |
| `facilitator/` | 輸出（只給講師，不發給學員） | 講師手冊、進度表、評分表、小測驗解答 |
| `dist/` | 建置結果（不進 git） | `npm run build` 產生的示範頁 |
| `maintainers/` | 維護 | `PLAN.md`、`TASKS.md`、`tools/`、測試、`package.json`、CI 用的相依套件 |

- 指令都在 `maintainers/` 內執行（先 `npm ci`）：`npm run check`（步驟檢查、共用資源雜湊、測試）、`npm run build`。
- 任務進度看 `maintainers/TASKS.md`；計畫有變動先改 `maintainers/PLAN.md` 再同步任務清單。
- 改了任何一步的 `solution`，下一步的 `starter` 必須一起改成相同內容（CI 會檢查）。
- 內容用台灣繁體中文。
