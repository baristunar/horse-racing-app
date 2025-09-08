import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import App from '../App.vue'

describe('App.vue', () => {
  it('renders router-view', () => {
    const wrapper = shallowMount(App, { global: { stubs: ['router-view'] } })

    expect(wrapper.html()).toContain('router-view')
  })
})
