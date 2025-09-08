import type { HorseListState, Horse } from '@store/types'
import type { Commit } from 'vuex'
import * as horseService from '@services/horseService'

const initialState = (): HorseListState => ({
  data: [],
})

export default {
  namespaced: true,
  state: initialState(),
  mutations: {
    SET_HORSES(state: HorseListState, horses: Horse[]) {
      state.data = horses
    },
    RESET_HORSE_LIST(state: HorseListState) {
      Object.assign(state, initialState())
    },
  },
  actions: {
    initHorses({ commit }: { commit: Commit }) {
      const horses = horseService.getHorses()
      commit('SET_HORSES', horses)
    },
  },
  getters: {
    getAllHorses(state: HorseListState) {
      return state.data
    },
  },
}
