import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import App from '../solution/App.vue'

test('reset 會歸零', async () => {
  const wrapper = mount(App)
  await wrapper.find('button').trigger('click')
  await wrapper.find('button.reset').trigger('click')
  expect(wrapper.text()).toContain('count: 0')
})
