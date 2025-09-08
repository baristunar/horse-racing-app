import { describe, it, expect, vi, afterEach } from 'vitest'
import raceModule from '@store/modules/race'
import type { RaceState, Horse, RaceResultItem, RaceScheduleItem } from '@store/types'

describe('store/modules/race', () => {
  afterEach(() => vi.restoreAllMocks())

  it('mutations update race state correctly', () => {
    const state: RaceState = {
      isRaceInProgress: false,
      isRaceFinished: false,
      currentLap: { distance: 0, round: 0 },
      totalRounds: 6,
      currentRacingHorses: [],
    }

    const module = raceModule as unknown as {
      mutations: {
        SET_RACE_IS_IN_PROGRESS(s: RaceState, v: boolean): void
        SET_TOTAL_ROUNDS(s: RaceState, n: number): void
        SET_CURRENT_LAP(s: RaceState, lap: { distance: number; round: number }): void
        SET_CURRENT_RACING_HORSES(s: RaceState, horses: Horse[]): void
        SET_RACE_IS_FINISHED(s: RaceState, v: boolean): void
        RESET_STATE(s: RaceState): void
      }
    }

    module.mutations.SET_RACE_IS_IN_PROGRESS(state, true)
    expect(state.isRaceInProgress).toBe(true)
    module.mutations.SET_TOTAL_ROUNDS(state, 10)
    expect(state.totalRounds).toBe(10)
    module.mutations.SET_CURRENT_LAP(state, { distance: 50, round: 2 })
    expect(state.currentLap).toEqual({ distance: 50, round: 2 })

    const horses: Horse[] = [{ id: 1, name: 'x', condition: 1, color: { name: 'c', hex: '#000' } }]

    module.mutations.SET_CURRENT_RACING_HORSES(state, horses)
    expect(state.currentRacingHorses).toBe(horses)
    module.mutations.SET_RACE_IS_FINISHED(state, true)
    expect(state.isRaceFinished).toBe(true)
    module.mutations.RESET_STATE(state)
    expect(state.isRaceInProgress).toBe(false)
    expect(state.currentLap.round).toBe(0)
  })

  it('action startRace commits the expected mutations', () => {
    const commit = vi.fn()
    const payload = {
      distance: 100,
      round: 1,
      horses: [{ id: 2, name: 'n', condition: 1, color: { name: 'c', hex: '#000' } }] as Horse[],
    }

    const module = raceModule as unknown as {
      actions: {
        startRace(
          ctx: { commit: (t: string, p?: unknown) => void },
          payload: { distance: number; round: number; horses: Horse[] },
        ): void
      }
    }

    module.actions.startRace({ commit }, payload)
    expect(commit).toHaveBeenCalledWith('SET_RACE_IS_IN_PROGRESS', true)
    expect(commit).toHaveBeenCalledWith('SET_CURRENT_LAP', { distance: 100, round: 1 })
    expect(commit).toHaveBeenCalledWith('SET_CURRENT_RACING_HORSES', payload.horses)
    expect(commit).toHaveBeenCalledWith('SET_RACE_IS_FINISHED', false)
  })

  it('action finishRace handles next round when schedule present', () => {
    const commit = vi.fn()
    const state: RaceState = {
      isRaceInProgress: false,
      isRaceFinished: false,
      currentLap: { round: 0, distance: 0 },
      totalRounds: 2,
      currentRacingHorses: [],
    }
    const rootState: { schedule?: { data?: RaceScheduleItem[] } } = {
      schedule: {
        data: [
          {
            id: 1,
            distance: 30,
            round: 1,
            participants: [
              { id: 9, name: 'x', condition: 1, color: { name: 'c', hex: '#000' } },
            ] as Horse[],
          },
        ],
      },
    }

    const result: RaceResultItem = {
      round: 0,
      standing: [{ id: 1, name: 'a', condition: 1, color: { name: 'c', hex: '#000' } }],
    }

    const spy = vi.spyOn(window, 'dispatchEvent')

    const module = raceModule as unknown as {
      actions: {
        finishRace(
          ctx: {
            commit: (t: string, p?: unknown, o?: object) => void
            state: RaceState
            rootState: { schedule?: { data?: RaceScheduleItem[] } }
          },
          result: RaceResultItem,
        ): void
      }
    }

    module.actions.finishRace({ commit, state, rootState }, result)

    expect(commit).toHaveBeenCalledWith('SET_RACE_IS_FINISHED', true)
    expect(commit).toHaveBeenCalledWith('SET_RACE_IS_IN_PROGRESS', false)
    expect(commit).toHaveBeenCalledWith('results/SET_RACE_RESULTS', result, { root: true })
    expect(commit).toHaveBeenCalledWith('SET_CURRENT_LAP', { distance: 30, round: 1 })

    const expectedParticipants = rootState.schedule!.data![0].participants

    expect(commit).toHaveBeenCalledWith('SET_CURRENT_RACING_HORSES', expectedParticipants)
    expect(commit).toHaveBeenCalledWith('SET_RACE_IS_FINISHED', false)
    expect(commit).toHaveBeenCalledWith('SET_RACE_IS_IN_PROGRESS', true)
    expect(spy).toHaveBeenCalled()
  })

  it('action nextRound commits expected mutations', () => {
    const commit = vi.fn()
    const module = raceModule as unknown as {
      actions: {
        nextRound(
          ctx: { commit: (t: string, p?: unknown) => void },
          payload: { distance: number; round: number; horses: Horse[] },
        ): void
      }
    }

    module.actions.nextRound(
      { commit },
      {
        distance: 20,
        round: 3,
        horses: [{ id: 5, name: 'n', condition: 1, color: { name: 'c', hex: '#000' } } as Horse],
      },
    )
    expect(commit).toHaveBeenCalledWith('SET_CURRENT_LAP', { distance: 20, round: 3 })
    expect(commit).toHaveBeenCalledWith('SET_CURRENT_RACING_HORSES', [
      { id: 5, name: 'n', condition: 1, color: { name: 'c', hex: '#000' } },
    ])
    expect(commit).toHaveBeenCalledWith('SET_RACE_IS_FINISHED', false)
    expect(commit).toHaveBeenCalledWith('SET_RACE_IS_IN_PROGRESS', true)
  })

  it('action pauseRace and resumeRace toggle progress', () => {
    const commit = vi.fn()
    const module = raceModule as unknown as {
      actions: {
        pauseRace(ctx: { commit: (t: string, p?: unknown) => void }): void
        resumeRace(ctx: { commit: (t: string, p?: unknown) => void }): void
      }
    }

    module.actions.pauseRace({ commit })
    expect(commit).toHaveBeenCalledWith('SET_RACE_IS_IN_PROGRESS', false)
    module.actions.resumeRace({ commit })
    expect(commit).toHaveBeenCalledWith('SET_RACE_IS_IN_PROGRESS', true)
  })
})
