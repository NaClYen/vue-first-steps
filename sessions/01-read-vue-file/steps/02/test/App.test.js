import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import App from '../solution/App.vue'

test('點「加一」人數加 1', async () => {
  const wrapper = mount(App)
  const button = wrapper.findAll('button').find((b) => b.text() === '加一')
  expect(button).toBeTruthy()
  await button.trigger('click')
  expect(wrapper.find('p').text()).toBe('目前人數：13')
  await button.trigger('click')
  expect(wrapper.find('p').text()).toBe('目前人數：14')
})
