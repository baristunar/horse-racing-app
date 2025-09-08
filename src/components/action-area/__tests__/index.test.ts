import { describe, it, expect, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createStore } from 'vuex'
import ActionArea from '@components/action-area/index.vue'

const makeStore = (overrides = {}) => {
  return createStore({
    state: {
      race: { isRaceInProgress: false, currentLap: null },
      horses: { data: [] },
      schedule: { data: [] },
      ...overrides,
    },
  })
}

describe('ActionArea', () => {
  it('renders Generate Program and Start when no horses generated', () => {
    const store = makeStore()
    const wrapper = shallowMount(ActionArea, {
      global: {
        plugins: [store],
        stubs: {
          Button: {
            props: ['handleClick', 'disabled'],
            template: '<button :disabled="disabled" @click="handleClick"><slot /></button>',
          },
        },
      },
    })

    const buttons = wrapper.findAll('button')
    expect(buttons).toHaveLength(2)
    expect(buttons[0].text()).toBe('Generate Program')
    expect(buttons[1].text()).toBe('Start')
  })

  it('renders Pause when race is in progress and horses present', async () => {
    const store = makeStore({
      race: { isRaceInProgress: true, currentLap: { round: 1 } },
      horses: { data: [{ id: 1, name: 'H1' }] },
    })

    const wrapper = shallowMount(ActionArea, {
      global: {
        plugins: [store],
        stubs: {
          Button: {
            props: ['handleClick', 'disabled'],
            template: '<button :disabled="disabled" @click="handleClick"><slot /></button>',
          },
        },
      },
    })

    const buttons = wrapper.findAll('button')
    expect(buttons[1].text()).toBe('Pause')
  })

  it('renders Generate Program button with disabled attribute when horses are generated', () => {
    const store = makeStore({
      horses: { data: [{ id: 1, name: 'H1' }] },
    })

    const wrapper = shallowMount(ActionArea, {
      global: {
        plugins: [store],
        stubs: {
          Button: {
            props: ['handleClick', 'disabled'],
            template: '<button :disabled="disabled" @click="handleClick"><slot /></button>',
          },
        },
      },
    })

    const buttons = wrapper.findAll('button')
    expect(buttons[0].attributes('disabled')).toBeDefined()
    expect(buttons[0].text()).toBe('Generate Program')
  })

  it('renders Start button with name is Pause if race is on going', () => {
    const store = makeStore({
      race: { isRaceInProgress: true, currentLap: { round: 1 } },
      horses: { data: [{ id: 1, name: 'H1' }] },
    })

    const wrapper = shallowMount(ActionArea, {
      global: {
        plugins: [store],
        stubs: {
          Button: {
            props: ['handleClick', 'disabled'],
            template: '<button :disabled="disabled" @click="handleClick"><slot /></button>',
          },
        },
      },
    })

    const buttons = wrapper.findAll('button')
    expect(buttons[1].text()).toBe('Pause')
    expect(buttons[1].attributes('disabled')).toBeUndefined()

    expect(buttons[0].text()).toBe('Generate Program')
    expect(buttons[0].attributes('disabled')).toBeDefined()
  })

  it('handle click events on start button', () => {
    const store = makeStore({
      horses: { data: [{ id: 1, name: 'H1' }] },
      schedule: {
        data: [{ id: 1, round: 1, distance: 1200, participants: [{ id: 1, name: 'H1' }] }],
      },
    })

    const dispatchSpy = vi.spyOn(store, 'dispatch')

    const wrapper = shallowMount(ActionArea, {
      global: {
        plugins: [store],
        stubs: {
          Button: {
            props: ['handleClick', 'disabled'],
            template: '<button :disabled="disabled" @click="handleClick"><slot /></button>',
          },
        },
      },
    })

    const buttons = wrapper.findAll('button')
    buttons[1].trigger('click')

    expect(dispatchSpy).toHaveBeenCalled()
    expect(dispatchSpy).toHaveBeenCalledWith('race/startRace', expect.any(Object))
  })

  it('handle click events on pause button', () => {
    const store = makeStore({
      race: { isRaceInProgress: true, currentLap: { round: 1 } },
      horses: { data: [{ id: 1, name: 'H1' }] },
    })

    const dispatchSpy = vi.spyOn(store, 'dispatch')

    const wrapper = shallowMount(ActionArea, {
      global: {
        plugins: [store],
        stubs: {
          Button: {
            props: ['handleClick', 'disabled'],
            template: '<button :disabled="disabled" @click="handleClick"><slot /></button>',
          },
        },
      },
    })

    const buttons = wrapper.findAll('button')
    buttons[1].trigger('click')

    expect(dispatchSpy).toHaveBeenCalled()
    expect(dispatchSpy).toHaveBeenCalledWith('race/pauseRace')
  })

  it('generate button dispatches initHorses and generateRaceSchedule when no horses', () => {
    const store = makeStore({ horses: { data: [] }, schedule: { data: [] } })
    const dispatchSpy = vi.spyOn(store, 'dispatch')

    const wrapper = shallowMount(ActionArea, {
      global: {
        plugins: [store],
        stubs: {
          Button: {
            props: ['handleClick', 'disabled'],
            template: '<button :disabled="disabled" @click="handleClick"><slot /></button>',
          },
        },
      },
    })

    const buttons = wrapper.findAll('button')
    buttons[0].trigger('click')

    expect(dispatchSpy).toHaveBeenCalled()
    expect(dispatchSpy).toHaveBeenCalledWith('horses/initHorses')
    expect(dispatchSpy).toHaveBeenCalledWith('schedule/generateRaceSchedule')
  })

  it('generate button does nothing when horses already generated', () => {
    const store = makeStore({ horses: { data: [{ id: 1, name: 'H1' }] } })
    const dispatchSpy = vi.spyOn(store, 'dispatch')

    const wrapper = shallowMount(ActionArea, {
      global: {
        plugins: [store],
        stubs: {
          Button: {
            props: ['handleClick', 'disabled'],
            template: '<button :disabled="disabled" @click="handleClick"><slot /></button>',
          },
        },
      },
    })

    const buttons = wrapper.findAll('button')
    buttons[0].trigger('click')

    expect(dispatchSpy).not.toHaveBeenCalled()
  })

  it('play button resumes race when currentLap exists and not started', () => {
    const store = makeStore({
      race: { isRaceInProgress: false, currentLap: { round: 2 } },
      horses: { data: [{ id: 1, name: 'H1' }] },
    })
    const dispatchSpy = vi.spyOn(store, 'dispatch')

    const wrapper = shallowMount(ActionArea, {
      global: {
        plugins: [store],
        stubs: {
          Button: {
            props: ['handleClick', 'disabled'],
            template: '<button :disabled="disabled" @click="handleClick"><slot /></button>',
          },
        },
      },
    })

    const buttons = wrapper.findAll('button')
    buttons[1].trigger('click')

    expect(dispatchSpy).toHaveBeenCalledWith('race/resumeRace')
  })

  it('play button style reflects started and generated states', () => {
    const storeStarted = makeStore({
      race: { isRaceInProgress: true },
      horses: { data: [{ id: 1 }] },
    })
    const wrapperStarted = shallowMount(ActionArea, {
      global: {
        plugins: [storeStarted],
        stubs: {
          Button: {
            props: ['handleClick', 'disabled'],
            template: '<button :disabled="disabled" @click="handleClick"><slot /></button>',
          },
        },
      },
    })
    const styleStarted = wrapperStarted.findAll('button')[1].attributes('style') || ''
    expect(styleStarted).toContain('var(--error)')

    const storeNotStarted = makeStore({
      race: { isRaceInProgress: false },
      horses: { data: [{ id: 1 }] },
    })
    const wrapperNotStarted = shallowMount(ActionArea, {
      global: {
        plugins: [storeNotStarted],
        stubs: {
          Button: {
            props: ['handleClick', 'disabled'],
            template: '<button :disabled="disabled" @click="handleClick"><slot /></button>',
          },
        },
      },
    })
    const styleNotStarted = wrapperNotStarted.findAll('button')[1].attributes('style') || ''
    expect(styleNotStarted).toContain('var(--success)')
  })
})
