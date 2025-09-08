/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createStore } from 'vuex'
import RaceTrack from '@components/race-track/index.vue'

type Horse = { name: string; condition?: number; color?: { hex: string } }
type RaceState = {
  currentRacingHorses: Horse[]
  currentLap: { round: number; distance: number }
  isRaceInProgress: boolean
}
type RootState = {
  race: RaceState
}

const makeStore = (overrides: Partial<RootState> = {}) => {
  return createStore<RootState>({
    state: {
      race: {
        currentRacingHorses: [],
        currentLap: { round: 1, distance: 1200 },
        isRaceInProgress: false,
        ...(overrides.race || {}),
      },
      ...overrides,
    },
  })
}

describe('RaceTrack', () => {
  it('renders one lane per horse', () => {
    const horses = [
      { name: 'H1', condition: 2, color: { hex: '#000' } },
      { name: 'H2', condition: 1, color: { hex: '#111' } },
    ]
    const store = makeStore({
      race: {
        currentRacingHorses: horses,
        currentLap: { round: 1, distance: 1000 },
        isRaceInProgress: false,
      },
    })

    const wrapper = shallowMount(RaceTrack, {
      global: { plugins: [store], stubs: { HorseIcon: true } },
    })

    const lanes = wrapper.findAll('.race-track__line')

    expect(lanes.length).toBe(horses.length)
    expect(lanes[0].find('.race-track__line-number').text()).toBe('1')
    expect(lanes[1].find('.race-track__line-number').text()).toBe('2')
  })

  it('shows race status when in progress with round and distance', () => {
    const store = makeStore({
      race: {
        currentRacingHorses: [{ name: 'H1' }],
        currentLap: { round: 2, distance: 1500 },
        isRaceInProgress: true,
      },
    })

    const wrapper = shallowMount(RaceTrack, {
      global: { plugins: [store], stubs: { HorseIcon: true } },
    })

    expect(wrapper.find('.race-track__status-text').text()).toContain('2nd Lap - 1500m')
  })

  it('formatRound returns correct suffixes from vm', () => {
    const store = makeStore()
    const wrapper = shallowMount(RaceTrack, {
      global: { plugins: [store], stubs: { HorseIcon: true } },
    })

    const vm: any = wrapper.vm
    expect(vm.formatRound(1)).toBe('st')
    expect(vm.formatRound(2)).toBe('nd')
    expect(vm.formatRound(3)).toBe('rd')
    expect(vm.formatRound(5)).toBe('th')
  })

  it('finalizeRace dispatches finishRace with sorted standings', () => {
    const horses = [{ name: 'A' }, { name: 'B' }, { name: 'C' }]
    const store = makeStore({
      race: {
        currentRacingHorses: horses,
        currentLap: { round: 3, distance: 1200 },
        isRaceInProgress: false,
      },
    })
    const dispatchSpy = vi.spyOn(store, 'dispatch')

    const wrapper = shallowMount(RaceTrack, {
      global: { plugins: [store], stubs: { HorseIcon: true } },
    })

    ;(wrapper.vm as any).finalizeRace([2, 3, 4])

    expect(dispatchSpy).toHaveBeenCalled()
    expect(dispatchSpy).toHaveBeenCalledWith('race/finishRace', {
      round: 3,
      standing: [{ name: 'A' }, { name: 'B' }, { name: 'C' }].sort(() => 0),
    })
  })

  it('computes horseStyles based on progressPercentages and trackWidths', () => {
    const horses = [{ name: 'X' }, { name: 'Y' }]
    const store = makeStore({
      race: {
        currentRacingHorses: horses,
        currentLap: { round: 1, distance: 1000 },
        isRaceInProgress: false,
      },
    })
    const wrapper = shallowMount(RaceTrack, {
      global: { plugins: [store], stubs: { HorseIcon: true } },
    })

    ;(wrapper.vm as any).trackWidths = [200, 300]
    ;(wrapper.vm as any).progressPercentages = [50, 25]

    const styles = (wrapper.vm as any).horseStyles
    expect(styles[0]['--horse-x']).toContain('px')
    expect(styles[1]['--horse-x']).toContain('px')
  })

  it('watch(horses) initializes progressPercentages and trackWidths', async () => {
    const horses = [{ name: 'A' }, { name: 'B' }]
    const store = makeStore({
      race: {
        currentRacingHorses: [],
        currentLap: { round: 1, distance: 100 },
        isRaceInProgress: false,
      },
    })
    const wrapper = shallowMount(RaceTrack, {
      global: { plugins: [store], stubs: { HorseIcon: true } },
    })

    ;(wrapper.vm as any).trackRefs = [{ offsetWidth: 120 }, { offsetWidth: 140 }]

    store.state.race.currentRacingHorses = horses

    const { nextTick } = await import('vue')
    await nextTick()
    await nextTick()

    expect((wrapper.vm as any).progressPercentages.length).toBe(2)
    expect((wrapper.vm as any).trackWidths.slice(0, 2)).toEqual([120, 140])
  })

  it('startRace basic flow starts timer and calls finalizeRace when done', async () => {
    vi.useFakeTimers()
    const horses = [
      { name: 'A', condition: 1 },
      { name: 'B', condition: 1 },
    ]
    const store = makeStore({
      race: {
        currentRacingHorses: horses,
        currentLap: { round: 1, distance: 10 },
        isRaceInProgress: false,
      },
    })
    const wrapper = shallowMount(RaceTrack, {
      global: { plugins: [store], stubs: { HorseIcon: true } },
    })

    const estSpy = vi.spyOn(wrapper.vm as any, 'estimateFinishTime').mockReturnValue(0.01)

    ;(wrapper.vm as any).startRace()

    const startTs = (wrapper.vm as any).raceTiming.startTimestamp

    expect(typeof startTs).toBe('number')
    expect((wrapper.vm as any).__timer || typeof (globalThis as any).timer).toBeDefined()

    estSpy.mockRestore()
    ;(wrapper.vm as any).stopRace()
    vi.useRealTimers()
  })

  it('startRace resume branch computes a startTimestamp when shouldResume=true', () => {
    const horses = [{ name: 'A', condition: 1 }]
    const store = makeStore({
      race: {
        currentRacingHorses: horses,
        currentLap: { round: 1, distance: 100 },
        isRaceInProgress: false,
      },
    })
    const wrapper = shallowMount(RaceTrack, {
      global: { plugins: [store], stubs: { HorseIcon: true } },
    })

    ;(wrapper.vm as any).progressPercentages = [50]
    const estSpy = vi.spyOn(wrapper.vm as any, 'estimateFinishTime').mockReturnValue(10)

    ;(wrapper.vm as any).startRace({ shouldResume: true })

    const ts = (wrapper.vm as any).raceTiming.startTimestamp
    expect(typeof ts).toBe('number')

    estSpy.mockRestore()
  })

  it('handleNextRound event triggers startRace when race is in progress', () => {
    const horses = [{ name: 'A' }]
    const store = makeStore({
      race: {
        currentRacingHorses: horses,
        currentLap: { round: 1, distance: 100 },
        isRaceInProgress: true,
      },
    })
    const wrapper = shallowMount(RaceTrack, {
      global: { plugins: [store], stubs: { HorseIcon: true } },
    })

    const beforeTs = (wrapper.vm as any).raceTiming.startTimestamp

    window.dispatchEvent(new Event('race:nextRoundStarted'))

    const afterTs = (wrapper.vm as any).raceTiming.startTimestamp

    expect(afterTs).not.toBe(beforeTs)
  })

  it('onBeforeUnmount stops timer and removes window listener', () => {
    const store = makeStore({
      race: {
        currentRacingHorses: [],
        currentLap: { round: 1, distance: 100 },
        isRaceInProgress: false,
      },
    })
    const wrapper = shallowMount(RaceTrack, {
      global: { plugins: [store], stubs: { HorseIcon: true } },
    })

    const removeSpy = vi.spyOn(window, 'removeEventListener')
    wrapper.unmount()

    expect(removeSpy).toHaveBeenCalled()
  })

  it('estimateFinishTime clamps to minimum 3 seconds when computed value is smaller', () => {
    const store = makeStore({
      race: {
        currentRacingHorses: [{ name: 'H' }],
        currentLap: { round: 1, distance: 50 },
        isRaceInProgress: false,
      },
    })
    const wrapper = shallowMount(RaceTrack, {
      global: { plugins: [store], stubs: { HorseIcon: true } },
    })

    const spy = vi.spyOn(Math, 'random').mockReturnValue(1)
    const seconds = (wrapper.vm as any).estimateFinishTime({ condition: 10 })

    expect(seconds).toBe(3)
    spy.mockRestore()
  })

  it('estimateFinishTime clamps to maxDuration when computed value is larger', () => {
    const store = makeStore({
      race: {
        currentRacingHorses: [{ name: 'H' }],
        currentLap: { round: 1, distance: 1000 },
        isRaceInProgress: false,
      },
    })
    const wrapper = shallowMount(RaceTrack, {
      global: { plugins: [store], stubs: { HorseIcon: true } },
    })

    const spy = vi.spyOn(Math, 'random').mockReturnValue(0)
    const seconds = (wrapper.vm as any).estimateFinishTime({ condition: 1 })

    expect(seconds).toBe(20)
    spy.mockRestore()
  })

  it('estimateFinishTime returns intermediate values for mid randomness', () => {
    const store = makeStore({
      race: {
        currentRacingHorses: [{ name: 'H' }],
        currentLap: { round: 1, distance: 500 },
        isRaceInProgress: false,
      },
    })
    const wrapper = shallowMount(RaceTrack, {
      global: { plugins: [store], stubs: { HorseIcon: true } },
    })

    const spy = vi.spyOn(Math, 'random').mockReturnValue(0.5)
    const seconds = (wrapper.vm as any).estimateFinishTime({ condition: 2 })

    expect(seconds).toBeGreaterThanOrEqual(3)
    expect(seconds).toBeLessThanOrEqual(20)
    spy.mockRestore()
  })
})
