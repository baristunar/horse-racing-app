import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createStore } from 'vuex'
import HorseList from '../index.vue'

function makeStore(overrides = {}) {
  return createStore({
    state: {
      horses: { data: [] },
      ...overrides,
    },
  })
}

describe('HorseList', () => {
  it('passes correct head and empty body when no horses', () => {
    const store = makeStore()

    const wrapper = shallowMount(HorseList, {
      global: {
        plugins: [store],
        stubs: {
          Table: {
            props: ['head', 'body'],
            template:
              '<div :data-head="JSON.stringify(head)" :data-body="JSON.stringify(body)"></div>',
          },
        },
      },
    })

    const table = wrapper.find('div')

    expect(table.exists()).toBe(true)
    expect(table.attributes('data-head')).toBeDefined()
    const bodyAttr = table.attributes('data-body')

    expect(bodyAttr).toBeDefined()
    expect(bodyAttr).toContain('[]')
  })

  it('maps horses into table body correctly', () => {
    const horses = [
      { id: 1, name: 'Ruby Racer', condition: 60, color: { name: 'Black' } },
      { id: 2, name: 'Blaze Runner', condition: 40, color: { name: 'Brown' } },
    ]
    const store = makeStore({ horses: { data: horses } })

    const wrapper = shallowMount(HorseList, {
      global: {
        plugins: [store],
        stubs: {
          Table: {
            props: ['head', 'body'],
            template:
              '<div :data-head="JSON.stringify(head)" :data-body="JSON.stringify(body)"></div>',
          },
        },
      },
    })

    const table = wrapper.find('div')
    expect(table.exists()).toBe(true)

    const bodyAttr = table.attributes('data-body')

    expect(bodyAttr).toBeDefined()
    expect(bodyAttr).toContain('Ruby Racer')
    expect(bodyAttr).toContain('Blaze Runner')
    expect(bodyAttr).toContain('Black')
    expect(bodyAttr).toContain('Brown')
  })
})
