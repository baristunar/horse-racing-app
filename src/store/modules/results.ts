import type { RaceResultsState, RaceResultItem } from '@store/types'

const initialState = (): RaceResultsState => ({
  data: [],
})

export default {
  namespaced: true,
  state: initialState(),
  mutations: {
    SET_RACE_RESULTS(state: RaceResultsState, results: RaceResultItem) {
      state.data.push(results)
    },
    RESET_RESULT_STATE(state: RaceResultsState) {
      Object.assign(state, initialState())
    },
  },
  getters: {
    getRaceResults(state: RaceResultsState) {
      return state.data
    },
  },
}
