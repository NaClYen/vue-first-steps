// 文件頁共用腳本：程式碼上色、複製按鈕、原始碼連結的「複製路徑」。沒有它頁面仍可閱讀，只是程式碼不上色。
;(function () {
  // 程式碼區塊：由 data-lang 或 class="language-xxx" 決定語言，找不到就當純文字。
  function highlightAll() {
    if (!window.hljs) return
    document.querySelectorAll('pre.code code').forEach(function (block) {
      var lang = block.dataset.lang
      if (!lang) {
        var match = /language-([\w-]+)/.exec(block.className)
        lang = match ? match[1] : ''
      }
      if (!lang || !window.hljs.getLanguage(lang)) return
      var text = block.textContent
      block.innerHTML = window.hljs.highlight(text, {
        language: lang,
        ignoreIllegals: true,
      }).value
      block.classList.add('hljs')
    })
  }

  // data-copy 按鈕：clipboard 可能被拒絕，失敗時改為選取文字。
  function wireCopy() {
    document.querySelectorAll('[data-copy]').forEach(function (button) {
      button.addEventListener('click', async function () {
        try {
          await navigator.clipboard.writeText(button.dataset.copy)
          button.textContent = '已複製'
        } catch (error) {
          var range = document.createRange()
          range.selectNodeContents(button.previousElementSibling)
          var selection = window.getSelection()
          selection.removeAllRanges()
          selection.addRange(range)
          button.textContent = '請按 Ctrl+C'
        }
        setTimeout(function () {
          button.textContent = '複製'
        }, 1500)
      })
    })
  }

  // 指向原始碼的連結（data-path）旁加「複製路徑」：貼到 VS Code 的 Ctrl+P 就能開檔。
  function addPathButtons() {
    document.querySelectorAll('a[data-path]').forEach(function (link) {
      var button = document.createElement('button')
      button.type = 'button'
      button.className = 'copy-path'
      button.dataset.copy = link.dataset.path
      button.title = link.dataset.path
      button.textContent = '複製路徑'
      button.setAttribute('aria-label', '複製路徑：' + link.dataset.path)
      link.insertAdjacentElement('afterend', button)
    })
  }

  highlightAll()
  addPathButtons()
  wireCopy()
})()
