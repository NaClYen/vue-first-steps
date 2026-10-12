import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import App from '../solution/App.vue'

const press = (wrapper, label) => wrapper.findAll('button').find((b) => b.text() === label)

test('加一與減一', async () => {
  const wrapper = mount(App)
  await press(wrapper, '加一').trigger('click')
  expect(wrapper.find('p').text()).toBe('目前人數：13')
  await press(wrapper, '減一').trigger('click')
  await press(wrapper, '減一').trigger('click')
  expect(wrapper.find('p').text()).toBe('目前人數：11')
})

test('人數不會小於 0', async () => {
  const wrapper = mount(App)
  for (let i = 0; i < 15; i++) await press(wrapper, '減一').trigger('click')
  expect(wrapper.find('p').text()).toBe('目前人數：0')
})
