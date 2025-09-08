import type { RaceScheduleItem, RaceScheduleState, Horse } from '@store/types'
import type { Commit } from 'vuex'
import { generateSchedule } from '@/utils/helpers/generateSchedule'

const initialState = () => ({
  data: [],
})

export default {
  namespaced: true,
  state: initialState(),
  mutations: {
    SET_RACE_SCHEDULE(state: RaceScheduleState, scheduleData: RaceScheduleItem[]) {
      state.data = scheduleData
    },
  },
  actions: {
    generateRaceSchedule({
      commit,
      rootState,
    }: {
      commit: Commit
      rootState: { horses?: { data?: Horse[] } }
    }) {
      const horsesPool: Horse[] = rootState?.horses?.data ?? []
      const schedule = generateSchedule({
        horseList: horsesPool,
        rounds: 6,
        participantsPerRound: 10,
      })
      commit('SET_RACE_SCHEDULE', schedule as RaceScheduleItem[])
    },
  },
  getters: {
    getRaceSchedule(state: RaceScheduleState) {
      return state.data
    },
  },
}
