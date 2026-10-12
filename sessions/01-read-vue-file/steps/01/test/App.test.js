import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import App from '../solution/App.vue'

test('h1 顯示 title', () => {
  const wrapper = mount(App)
  expect(wrapper.find('h1').text()).toBe('Vue 第一步')
})

test('p 顯示目前人數', () => {
  const wrapper = mount(App)
  expect(wrapper.find('p').text()).toBe('目前人數：12')
})
