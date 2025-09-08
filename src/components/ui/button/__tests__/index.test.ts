import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from '@components/ui/button/index.vue'

describe('Button Component', () => {
  it('render correctly', () => {
    expect(Button).toBeTruthy()
  })

  it('render with given props', () => {
    const buttonText = 'Click Me'
    const wrapper = mount(Button, {
      slots: {
        default: buttonText,
      },
    })

    expect(wrapper.text()).toBe(buttonText)
  })

  it('handle click event', () => {
    const handleClick = vi.fn()
    const wrapper = mount(Button, {
      props: {
        handleClick,
      },
    })

    wrapper.trigger('click')
    expect(handleClick).toHaveBeenCalled()
  })
})
