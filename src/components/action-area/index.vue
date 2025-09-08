<template>
  <section class="action-area">
    <Button :disabled="isHorsesGenerated && !isFinished" :handle-click="generateBtnOnClick"
      >Generate Program</Button
    >
    <Button
      :disabled="isFinished || !isHorsesGenerated"
      :style="{
        background: getPlayButtonStyle(),
      }"
      :handle-click="playBtnOnClick"
      >{{ playBtnText }}
    </Button>
  </section>
</template>

<script setup lang="ts">
import './styles.scss'
import Button from '@components/ui/button/index.vue'
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

defineOptions({
  name: 'ActionArea',
})

const isStarted = computed(() => store.state.race.isRaceInProgress)
const isFinished = computed(() => store.state.race.isRaceFinished)
const playBtnText = computed(() => (isStarted.value ? 'Pause' : 'Start'))
const isHorsesGenerated = computed(() => store.state.horses.data.length > 0)

const getPlayButtonStyle = () => {
  if (!isHorsesGenerated.value) return ''
  return isStarted.value ? 'var(--error)' : 'var(--success)'
}

const playBtnOnClick = () => {
  if (isStarted.value) {
    store.dispatch('race/pauseRace')

    return
  }

  const currentLap = store.state.race.currentLap
  const hasCurrentLap = currentLap && currentLap.round > 0
  if (hasCurrentLap) {
    store.dispatch('race/resumeRace')
    return
  }

  const schedule = store.state.schedule?.data ?? []
  const currentRound = 1

  if (schedule.length > 0) {
    const roundItem = schedule[currentRound - 1]
    if (roundItem) {
      store.dispatch('race/startRace', {
        distance: roundItem.distance,
        round: roundItem.round,
        horses: roundItem.participants,
      })

      return
    }
  }
}

const generateBtnOnClick = () => {
  store.commit('race/RESET_STATE')
  store.commit('results/RESET_RESULT_STATE')
  store.commit('horses/RESET_HORSE_LIST')
  store.commit('schedule/RESET_RACE_SCHEDULE')
  store.dispatch('horses/initHorses')
  store.dispatch('schedule/generateRaceSchedule')
}
</script>
