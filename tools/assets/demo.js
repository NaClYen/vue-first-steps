// 示範頁：← → 切換上一段／下一段（每個 h2 一段），目前段落加外框。沒有它頁面仍可捲動閱讀。
;(function () {
  var sections = Array.prototype.slice.call(document.querySelectorAll('.demo h2'))
  if (!sections.length) return
  var index = -1
  function go(next) {
    index = Math.max(0, Math.min(sections.length - 1, next))
    sections.forEach(function (h, i) { h.classList.toggle('current', i === index) })
    sections[index].scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowRight') go(index + 1)
    if (event.key === 'ArrowLeft') go(index - 1)
  })
  var hint = document.createElement('div')
  hint.className = 'demo-hint'
  hint.textContent = '← → 切換段落'
  document.body.appendChild(hint)
})()
