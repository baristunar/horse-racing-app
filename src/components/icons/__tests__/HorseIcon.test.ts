import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import HorseIcon from '../HorseIcon.vue'

describe('HorseIcon', () => {
  it('renders svg with provided fill/width/height props', () => {
    const wrapper = shallowMount(HorseIcon, {
      props: { fill: '#ff0000', width: '24px', height: '30px' },
    })

    const svg = wrapper.find('svg')

    expect(svg.exists()).toBe(true)
    expect(svg.attributes('fill')).toBe('#ff0000')
    expect(svg.attributes('width')).toBe('24px')
    expect(svg.attributes('height')).toBe('30px')
  })

  it('uses default props when none are provided', () => {
    const wrapper = shallowMount(HorseIcon)
    const svg = wrapper.find('svg')

    expect(svg.exists()).toBe(true)
    expect(svg.attributes('fill')).toBe('#000000')
    expect(svg.attributes('width')).toBe('40px')
    expect(svg.attributes('height')).toBe('60px')
  })
})
