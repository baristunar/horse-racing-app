import { describe, it, expect } from 'vitest'
import Table from '@components/ui/table/index.vue'
import { mount } from '@vue/test-utils'

describe('Table Component', () => {
  it('render correctly', () => {
    expect(Table).toBeTruthy()
  })

  it('render with given props', () => {
    const head = ['Position', 'Name']
    const body = [
      [1, 'Solar Flare'],
      [2, 'Red Flurry'],
    ]
    const wrapper = mount(Table, {
      props: {
        head,
        body,
      },
    })

    const ths = wrapper.findAll('th')

    expect(ths).toHaveLength(head.length)
    ths.forEach((th, index) => {
      expect(th.text()).toBe(head[index])
    })

    const trs = wrapper.findAll('tbody tr')

    expect(trs).toHaveLength(body.length)
    trs.forEach((tr, rowIndex) => {
      const tds = tr.findAll('td')

      expect(tds).toHaveLength(body[rowIndex].length)
      tds.forEach((td, colIndex) => {
        expect(td.text()).toBe(String(body[rowIndex][colIndex]))
      })
    })
  })
})
