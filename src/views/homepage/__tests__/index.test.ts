import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createStore } from 'vuex'
import Homepage from '@views/homepage/index.vue'

const makeStore = (overrides = {}) => {
  return createStore({
    state: {
      horses: { data: [] },
      race: { isRaceInProgress: false, currentLap: null },
      schedule: { data: [] },
      ...overrides,
    },
  })
}

describe('Homepage view', () => {
  it('renders header and action area always, hides program-related components when no horses', () => {
    const store = makeStore()

    const wrapper = shallowMount(Homepage, {
      global: {
        plugins: [store],
        stubs: {
          AppHeader: true,
          ActionArea: true,
          HorseList: true,
          RaceTrack: true,
          RaceProgram: true,
        },
      },
    })

    expect(wrapper.find('app-header-stub').exists()).toBe(true)
    expect(wrapper.find('action-area-stub').exists()).toBe(true)

    expect(wrapper.find('horse-list-stub').exists()).toBe(false)
    expect(wrapper.find('race-track-stub').exists()).toBe(false)
    expect(wrapper.find('race-program-stub').exists()).toBe(false)
  })

  it('shows HorseList, RaceTrack and RaceProgram when program is generated', () => {
    const store = makeStore({ horses: { data: [{ id: 1, name: 'H1' }] } })

    const wrapper = shallowMount(Homepage, {
      global: {
        plugins: [store],
        stubs: {
          AppHeader: true,
          ActionArea: true,
          HorseList: true,
          RaceTrack: true,
          RaceProgram: true,
        },
      },
    })

    expect(wrapper.find('horse-list-stub').exists()).toBe(true)
    expect(wrapper.find('race-track-stub').exists()).toBe(true)
    expect(wrapper.find('race-program-stub').exists()).toBe(true)
  })
})
