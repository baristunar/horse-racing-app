import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import RaceSchedule from '@components/race-program/index.vue'

describe('RaceSchedule wrapper', () => {
  it('renders RaceProgram and RaceResults', () => {
    const wrapper = shallowMount(RaceSchedule, {
      global: {
        stubs: { RaceProgram: true, RaceResults: true },
      },
    })

    expect(wrapper.find('race-program-stub').exists()).toBe(true)
    expect(wrapper.find('race-results-stub').exists()).toBe(true)
  })
})
