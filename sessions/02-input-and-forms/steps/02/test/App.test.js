import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import App from '../solution/App.vue'

test('一開始的摘要', () => {
  const wrapper = mount(App)
  expect(wrapper.find('p').text()).toBe('標題：／優先：normal／緊急：否')
})

test('三個欄位都會更新摘要', async () => {
  const wrapper = mount(App)
  await wrapper.find('input[type="text"], input:not([type])').setValue('寫報告')
  await wrapper.find('select').setValue('high')
  await wrapper.find('input[type="checkbox"]').setValue(true)
  expect(wrapper.find('p').text()).toBe('標題：寫報告／優先：high／緊急：是')
})
