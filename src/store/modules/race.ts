import type { RaceState, Horse, RaceResultItem, RaceScheduleItem } from '@store/types'
import type { Commit } from 'vuex'

const initialState = (): RaceState => ({
  isRaceInProgress: false,
  isRaceFinished: false,
  currentLap: {
    distance: 0,
    round: 0,
  },
  totalRounds: 6,
  currentRacingHorses: [],
})

export default {
  namespaced: true,
  state: initialState,
  mutations: {
    SET_RACE_IS_IN_PROGRESS(state: RaceState, isInProgress: boolean) {
      state.isRaceInProgress = isInProgress
    },
    SET_TOTAL_ROUNDS(state: RaceState, rounds: number) {
      state.totalRounds = rounds
    },
    SET_CURRENT_LAP(state: RaceState, lap: { distance: number; round: number }) {
      state.currentLap = lap
    },
    SET_CURRENT_RACING_HORSES(state: RaceState, horses: Horse[]) {
      state.currentRacingHorses = horses
    },
    SET_RACE_IS_FINISHED(state: RaceState, isFinished: boolean) {
      state.isRaceFinished = isFinished
    },
    RESET_STATE(state: RaceState) {
      Object.assign(state, initialState())
    },
  },
  actions: {
    startRace(
      {
        commit,
      }: {
        commit: Commit
      },
      { distance, round, horses }: { distance: number; round: number; horses: Horse[] },
    ) {
      commit('SET_RACE_IS_IN_PROGRESS', true)
      commit('SET_CURRENT_LAP', { distance, round })
      commit('SET_CURRENT_RACING_HORSES', horses)
      commit('SET_RACE_IS_FINISHED', false)
    },
    pauseRace({ commit }: { commit: Commit }) {
      commit('SET_RACE_IS_IN_PROGRESS', false)
    },
    finishRace(
      {
        commit,
        state,
        rootState,
      }: {
        commit: Commit
        state: RaceState
        rootState: { schedule?: { data?: RaceScheduleItem[] } }
      },
      result: RaceResultItem,
    ) {
      commit('SET_RACE_IS_FINISHED', true)
      commit('SET_RACE_IS_IN_PROGRESS', false)
      commit('results/SET_RACE_RESULTS', result, { root: true })

      const currentRound = state.currentLap?.round ?? 0
      const totalRounds = state.totalRounds ?? 6
      const schedule: RaceScheduleItem[] = rootState?.schedule?.data ?? []

      if (currentRound < totalRounds) {
        const nextRoundItem = schedule[currentRound]

        if (nextRoundItem) {
          commit('SET_CURRENT_LAP', {
            distance: nextRoundItem.distance,
            round: nextRoundItem.round,
          })
          commit('SET_CURRENT_RACING_HORSES', nextRoundItem.participants)
          commit('SET_RACE_IS_FINISHED', false)
          commit('SET_RACE_IS_IN_PROGRESS', true)
          try {
            const event = new CustomEvent('race:nextRoundStarted', {
              detail: { round: nextRoundItem.round },
            })
            window.dispatchEvent(event)
          } catch {}
        }
      }
    },
    nextRound(
      { commit }: { commit: Commit },
      { distance, round, horses }: { distance: number; round: number; horses: Horse[] },
    ) {
      commit('SET_CURRENT_LAP', { distance, round })
      commit('SET_CURRENT_RACING_HORSES', horses)
      commit('SET_RACE_IS_FINISHED', false)
      commit('SET_RACE_IS_IN_PROGRESS', true)
    },
    resumeRace({ commit }: { commit: Commit }) {
      commit('SET_RACE_IS_IN_PROGRESS', true)
    },
  },
}
