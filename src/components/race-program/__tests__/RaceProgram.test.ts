/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createStore } from 'vuex'
import RaceProgram from '@components/race-program/RaceProgram.vue'
import type { Horse } from '@store/types'

vi.mock('@utils/helpers/generateSchedule', () => ({
  generateSchedule: ({ horseList }: { horseList: Horse[] }) => [
    { id: 1, round: 1, distance: 1200, participants: horseList },
  ],
}))

function makeStore(overrides = {}) {
  return createStore({
    state: {
      horses: { data: [] },
      schedule: { data: [] },
      ...overrides,
    },
  })
}

describe('RaceProgram', () => {
  it('formats round suffixes correctly', () => {
    const store = makeStore({ horses: { data: [] } })
    const wrapper = shallowMount(RaceProgram, {
      global: { plugins: [store], stubs: { Table: true } },
    })

    const vm: any = wrapper.vm
    expect(vm.formatRound(1)).toBe('st')
    expect(vm.formatRound(2)).toBe('nd')
    expect(vm.formatRound(3)).toBe('rd')
    expect(vm.formatRound(4)).toBe('th')
  })

  it('uses store schedule when present and maps participants to table body', () => {
    const participants = [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
    ]
    const schedule = [{ id: 10, round: 2, distance: 1400, participants }]
    const store = makeStore({ horses: { data: [] }, schedule: { data: schedule } })

    const wrapper = shallowMount(RaceProgram, {
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

    const div = wrapper.findAll('div').find((d) => d.attributes('data-body') !== undefined)
    const body = div?.attributes('data-body')
    expect(body).toContain('A')
    expect(body).toContain('B')
    expect(body).toContain('1')
    expect(body).toContain('2')
  })

  it('falls back to generateSchedule when store schedule is empty', () => {
    const horses = [{ id: 1, name: 'Ruby Racer' }]
    const store = makeStore({ horses: { data: horses }, schedule: { data: [] } })

    const wrapper = shallowMount(RaceProgram, {
      global: {
        plugins: [store],
        stubs: {
          Table: {
            props: ['head', 'body'],
            template: '<div :data-body="JSON.stringify(body)"></div>',
          },
        },
      },
    })

    const tableDiv = wrapper.findAll('div').find((d) => d.attributes('data-body') !== undefined)
    const body = tableDiv?.attributes('data-body') || ''

    expect(wrapper.text()).toContain('Lap - 1200m')
    expect(body).toContain('Ruby Racer')
  })
})
