# vue-first-steps

給「會 JavaScript、沒碰過 Vue」的工程師，用視訊會議帶領的 Vue 入門課。目標是讓大家能順著 [react-to-vue](https://github.com/NaClYen/react-to-vue) 的《從畫面讀 Vue》讀下去。

## 這個 repo 的兩邊

| 位置 | 給誰 | 內容 |
| --- | --- | --- |
| [`sessions/`](sessions/) | 學員（建置成示範頁） | 每場的 `index.md` 與每一步的 `starter`／`solution`／`test` |
| [`facilitator/`](facilitator/) | 講師與協助者，**不發給學員** | [講師手冊](facilitator/guide.md)、進度表、評分表、小測驗解答 |
| [`shared/`](shared/) | 輸出用的共用樣式 | 從 react-to-vue 標記版本複製，不可手改 |
| [`maintainers/`](maintainers/) | 維護者與 AI agent | [計畫書](maintainers/PLAN.md)、[任務清單](maintainers/TASKS.md)、建置與檢查工具、測試 |

## 課程場次

| 場次 | 內容 | 狀態 |
| --- | --- | --- |
| [S0](sessions/00-pre-class/index.md) | 課前準備：開連結、JS 小測驗 | 完成 |
| [S1](sessions/01-read-vue-file/index.md) | 看懂 `.vue` 檔 | 完成，待試行 |
| [S2](sessions/02-input-and-forms/index.md) | 輸入框與表單、讀錯誤訊息 | 完成，待試行 |
| S3–S9 | 見計畫書第 3 節 | 未開始（等試行結果） |

## 維護者怎麼用

```bash
cd maintainers
npm ci
npm run check   # 步驟檢查、共用資源雜湊、測試
npm run build   # 產生示範頁到 dist/
```

詳細規則見 [CLAUDE.md](CLAUDE.md)。
