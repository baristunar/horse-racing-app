/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createStore } from 'vuex'
import RaceResults from '@/components/race-program/RaceResults.vue'

function makeStore(overrides = {}) {
  return createStore({
    state: {
      horses: { data: [] },
      schedule: { data: [] },
      results: { data: [] },
      ...overrides,
    },
  })
}

describe('RaceResults', () => {
  it('renders table with standings when results exist for a round', () => {
    const participants = [
      { id: 1, name: 'Ruby Racer' },
      { id: 2, name: 'Scarlet Fish' },
    ]
    const schedule = [{ id: 1, round: 1, distance: 1200, participants }]
    const results = [{ round: 1, standing: participants }]

    const store = makeStore({ schedule: { data: schedule }, results: { data: results } })

    const wrapper = shallowMount(RaceResults, {
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
    expect(body).toContain('Ruby Racer')
    expect(body).toContain('Scarlet Fish')
    expect(body).toContain('1')
    expect(body).toContain('2')
  })

  it('shows No results yet when no results for the scheduled round', () => {
    const participants = [{ id: 1, name: 'A' }]
    const schedule = [{ id: 5, round: 2, distance: 1400, participants }]
    const store = makeStore({ schedule: { data: schedule }, results: { data: [] } })

    const wrapper = shallowMount(RaceResults, {
      global: {
        plugins: [store],
        stubs: { Table: true },
      },
    })

    expect(wrapper.text()).toContain('No results yet')
  })

  it('formatRound returns correct suffixes', () => {
    const store = makeStore()
    const wrapper = shallowMount(RaceResults, {
      global: { plugins: [store], stubs: { Table: true } },
    })
    const vm: any = wrapper.vm

    expect(vm.formatRound(1)).toBe('st')
    expect(vm.formatRound(2)).toBe('nd')
    expect(vm.formatRound(3)).toBe('rd')
    expect(vm.formatRound(4)).toBe('th')
  })
})
