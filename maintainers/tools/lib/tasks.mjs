// 題目寫在 starter 的註解裡，用 @task-start / @task-end 夾住（含這兩行）。
// starter 與「上一步 solution」的唯一允許差異就是這些題目區塊；比對與產生差異時先拿掉。
const START = /@task-start/
const END = /@task-end/

export function stripTasks(source) {
  const out = []
  let inside = false
  for (const line of source.split('\n')) {
    if (!inside && START.test(line)) {
      inside = true
      continue
    }
    if (inside) {
      if (END.test(line)) inside = false
      continue
    }
    out.push(line)
  }
  return out.join('\n')
}

export const hasTaskMarker = (source) => START.test(source) || END.test(source)

export const stripTaskTree = (files) =>
  Object.fromEntries(Object.entries(files).map(([name, source]) => [name, stripTasks(source)]))
