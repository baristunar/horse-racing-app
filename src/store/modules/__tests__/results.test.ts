import { describe, it, expect } from 'vitest'
import resultsModule from '@store/modules/results'
import type { RaceResultsState, RaceResultItem } from '@store/types'

describe('store/modules/results', () => {
  it('mutation SET_RACE_RESULTS pushes to state data', () => {
    const state: RaceResultsState = { data: [] }
    const item: RaceResultItem = {
      round: 1,
      standing: [{ id: 1, name: 'n', condition: 1, color: { name: 'c', hex: '#000' } }],
    }

    const module = resultsModule as unknown as {
      mutations: {
        SET_RACE_RESULTS(s: RaceResultsState, r: RaceResultItem): void
        RESET_RESULT_STATE(s: RaceResultsState): void
      }
      getters: { getRaceResults(s: RaceResultsState): RaceResultItem[] }
    }

    module.mutations.SET_RACE_RESULTS(state, item)
    expect(state.data.length).toBe(1)
    expect(state.data[0]).toBe(item)
  })

  it('mutation RESET_RESULT_STATE resets to initial', () => {
    const state: RaceResultsState = {
      data: [
        {
          round: 2,
          standing: [{ id: 2, name: 'n', condition: 1, color: { name: 'c', hex: '#000' } }],
        },
      ],
    }

    const module = resultsModule as unknown as {
      mutations: { RESET_RESULT_STATE(s: RaceResultsState): void }
    }

    module.mutations.RESET_RESULT_STATE(state)
    expect(state.data).toEqual([])
  })

  it('getter getRaceResults returns data', () => {
    const state: RaceResultsState = {
      data: [
        {
          round: 3,
          standing: [{ id: 3, name: 'n', condition: 1, color: { name: 'c', hex: '#000' } }],
        },
      ],
    }
    const module = resultsModule as unknown as {
      getters: { getRaceResults(s: RaceResultsState): RaceResultItem[] }
    }
    const res = module.getters.getRaceResults(state)

    expect(res).toEqual(state.data)
  })
})
