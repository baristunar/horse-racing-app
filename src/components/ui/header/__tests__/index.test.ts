import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import AppHeader from '@components/ui/header/index.vue'

describe('AppHeader', () => {
  it('renders the title and router-link', () => {
    const wrapper = shallowMount(AppHeader, {
      global: {
        stubs: {
          'router-link': {
            template: '<a><slot /></a>',
          },
        },
      },
    })

    const h1 = wrapper.find('h1')

    expect(h1.exists()).toBe(true)
    expect(h1.text()).toBe('Horse Racing App')

    const link = wrapper.find('a')

    expect(link.exists()).toBe(true)
  })
})
