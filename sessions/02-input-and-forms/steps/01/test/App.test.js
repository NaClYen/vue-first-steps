import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import App from '../solution/App.vue'

test('沒輸入時問候「同學」', () => {
  const wrapper = mount(App)
  expect(wrapper.find('p').text()).toBe('你好，同學')
})

test('打字時問候語跟著變', async () => {
  const wrapper = mount(App)
  await wrapper.find('input').setValue('小明')
  expect(wrapper.find('p').text()).toBe('你好，小明')
  await wrapper.find('input').setValue('')
  expect(wrapper.find('p').text()).toBe('你好，同學')
})
