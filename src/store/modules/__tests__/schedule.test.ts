import { describe, it, expect, vi, afterEach } from 'vitest'
import scheduleModule from '@store/modules/schedule'
import * as generate from '@utils/helpers/generateSchedule'
import type { RaceScheduleState, Horse, RaceScheduleItem } from '@store/types'

describe('store/modules/schedule', () => {
  afterEach(() => vi.restoreAllMocks())

  it('mutation SET_RACE_SCHEDULE sets the data', () => {
    const state: RaceScheduleState = { data: [] }
    const sched: RaceScheduleItem[] = [
      {
        id: 1,
        round: 1,
        participants: [{ id: 1, name: 'n', condition: 1, color: { name: 'c', hex: '#000' } }],
        distance: 1200,
      },
    ]

    const module = scheduleModule as unknown as {
      mutations: { SET_RACE_SCHEDULE(s: RaceScheduleState, d: RaceScheduleItem[]): void }
    }
    module.mutations.SET_RACE_SCHEDULE(state, sched)
    expect(state.data).toBe(sched)
  })

  it('action generateRaceSchedule uses generateSchedule and commits', () => {
    const commit = vi.fn()
    const horses: Horse[] = [{ id: 5, name: 'n', condition: 1, color: { name: 'c', hex: '#000' } }]
    const stubSchedule = [{ id: 1, round: 0, participants: horses, distance: 10 }] as unknown as {
      id: number
      round: number
      participants: Horse[]
      distance: number
    }[]

    vi.spyOn(generate, 'generateSchedule').mockReturnValue(stubSchedule)

    const module = scheduleModule as unknown as {
      actions: {
        generateRaceSchedule(ctx: {
          commit: (t: string, p?: unknown) => void
          rootState: { horses?: { data?: Horse[] } }
        }): void
      }
    }

    module.actions.generateRaceSchedule({ commit, rootState: { horses: { data: horses } } })

    expect(commit).toHaveBeenCalledWith('SET_RACE_SCHEDULE', stubSchedule)
  })
})
