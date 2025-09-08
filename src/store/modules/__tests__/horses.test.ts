import { describe, it, expect, vi, afterEach } from 'vitest'
import horsesModule from '@store/modules/horses'
import * as horseService from '@services/horseService'
import type { Horse, HorseListState } from '@store/types'

const makeHorse = (id: number, name = 'horse'): Horse => ({
  id,
  name,
  condition: 100,
  color: { name: 'red', hex: '#f00' },
})

describe('store/modules/horses', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('mutation SET_HORSES sets the state data', () => {
    const state: HorseListState = { data: [] }
    const horses: Horse[] = [makeHorse(1, 'A')]

    const module = horsesModule as unknown as {
      mutations: {
        SET_HORSES(s: HorseListState, h: Horse[]): void
      }
    }

    module.mutations.SET_HORSES(state, horses)
    expect(state.data).toBe(horses)
  })

  it('mutation RESET_HORSE_LIST resets to initial state', () => {
    const state: HorseListState = { data: [makeHorse(1)] }

    const module = horsesModule as unknown as {
      mutations: {
        RESET_HORSE_LIST(s: HorseListState): void
      }
    }

    module.mutations.RESET_HORSE_LIST(state)
    expect(state.data).toEqual([])
  })

  it('action initHorses commits SET_HORSES with service result', () => {
    const mockHorses: Horse[] = [makeHorse(2, 'B')]
    vi.spyOn(horseService, 'getHorses').mockReturnValue(mockHorses)

    type CommitFn = (type: string, payload?: unknown) => void
    const commit = vi.fn() as unknown as CommitFn

    const module = horsesModule as unknown as {
      actions: {
        initHorses(context: { commit: CommitFn }): void
      }
    }

    module.actions.initHorses({ commit })

    expect(commit).toHaveBeenCalledWith('SET_HORSES', mockHorses)
  })
})
