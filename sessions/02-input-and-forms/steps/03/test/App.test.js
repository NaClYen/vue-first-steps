import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import App from '../solution/App.vue'

test('一開始顯示尚未送出', () => {
  const wrapper = mount(App)
  expect(wrapper.find('.result').text()).toBe('已送出：尚未送出')
})

test('送出後顯示標題並清空輸入框', async () => {
  const wrapper = mount(App)
  await wrapper.find('input').setValue('寫報告')
  await wrapper.find('form').trigger('submit')
  expect(wrapper.find('.result').text()).toBe('已送出：寫報告')
  expect(wrapper.find('input').element.value).toBe('')
})

test('空白或全空白不能送出', async () => {
  const wrapper = mount(App)
  await wrapper.find('form').trigger('submit')
  expect(wrapper.find('.result').text()).toBe('已送出：尚未送出')
  await wrapper.find('input').setValue('   ')
  await wrapper.find('form').trigger('submit')
  expect(wrapper.find('.result').text()).toBe('已送出：尚未送出')
})
