import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import App from '../solution/App.vue'

test('點按鈕會加一', async () => {
  const wrapper = mount(App)
  expect(wrapper.text()).toContain('count: 0')
  await wrapper.find('button').trigger('click')
  expect(wrapper.text()).toContain('count: 1')
})
