import { compileScript, compileTemplate, parse } from '@vue/compiler-sfc'

// 編譯一個 .vue 檔；有任何解析或編譯錯誤就回傳錯誤訊息陣列（空陣列代表通過）
export function compileSfc(source, filename) {
  const errors = []
  const { descriptor, errors: parseErrors } = parse(source, { filename })
  for (const error of parseErrors) errors.push(`${filename}: ${error.message}`)
  if (parseErrors.length) return { errors, descriptor }
  const id = 'check'
  try {
    if (descriptor.script || descriptor.scriptSetup) {
      compileScript(descriptor, { id, inlineTemplate: false })
    }
    if (descriptor.template) {
      const result = compileTemplate({
        source: descriptor.template.content,
        filename,
        id,
        compilerOptions: { mode: 'module' },
      })
      for (const error of result.errors) {
        errors.push(`${filename}: ${typeof error === 'string' ? error : error.message}`)
      }
    }
  } catch (error) {
    errors.push(`${filename}: ${error.message}`)
  }
  return { errors, descriptor }
}
