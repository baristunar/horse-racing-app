<template>
  <section class="race-track">
    <div v-if="isRaceInProgress" class="race-track__status race-track__status--top">
      <span class="race-track__status-text">
        {{ currentRound }}{{ formatRound(currentRound) }} Lap - {{ raceDistance ?? 0 }}m
      </span>
    </div>
    <div class="race-track__line" v-for="(horse, index) in horses" :key="horse.name">
      <span class="race-track__line-number">{{ index + 1 }}</span>
      <span class="race-track__line-horse" ref="trackRefs">
        <div class="race-track__horse-anim" :style="horseStyles[index]">
          <HorseIcon :fill="horse?.color?.hex" />
        </div>
        <span class="race-track__finish-line"></span>
      </span>
    </div>
  </section>
</template>

<script setup lang="ts">
import './styles.scss'
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useStore } from 'vuex'
import HorseIcon from '@components/icons/HorseIcon.vue'

type Horse = {
  name: string
  condition?: number
  color?: { hex: string }
}

defineOptions({
  name: 'RaceTrack',
})
const store = useStore()

const horses = computed<Horse[]>(() => store.state.race.currentRacingHorses)
const raceDistance = computed(() => store.state.race.currentLap?.distance)
const isRaceInProgress = computed(() => store.state.race.isRaceInProgress)
const currentRound = computed(() => store.state.race.currentLap?.round ?? 0)

const progressPercentages = ref<number[]>([])
const trackRefs = ref<HTMLElement[]>([])
const trackWidths = ref<number[]>([])

let timer: number | null = null

watch(horses, async (list) => {
  progressPercentages.value = new Array(list.length).fill(0)

  await nextTick()

  trackWidths.value = trackRefs.value.map((el) => el?.offsetWidth || 0)
})

const calculateOffset = (index: number) => {
  const laneWidth = trackWidths.value[index] || 0
  const horseIconWidth = 40
  const maxTravel = Math.max(laneWidth - horseIconWidth, 0)

  return (progressPercentages.value[index] / 100) * maxTravel
}

const horseStyles = computed(() =>
  progressPercentages.value.map((_, i) => ({
    '--horse-x': `${calculateOffset(i)}px`,
  })),
)

const handleNextRound = () => {
  if (store.state.race.isRaceInProgress) {
    startRace()
  }
}

window.addEventListener('race:nextRoundStarted', handleNextRound)

const raceTiming = ref<{ durations: number[]; startTimestamp: number | null }>({
  durations: [],
  startTimestamp: null,
})

const startRace = (options?: { shouldResume?: boolean }) => {
  stopRace()

  trackWidths.value = trackRefs.value.map((el) => el?.offsetWidth || 0)

  if (!options?.shouldResume) {
    progressPercentages.value = new Array(horses.value.length).fill(0)
    raceTiming.value.durations = horses.value.map((h) => estimateFinishTime(h))
    raceTiming.value.startTimestamp = Date.now()
  } else {
    const now = Date.now()

    if (!raceTiming.value.durations || raceTiming.value.durations.length !== horses.value.length) {
      raceTiming.value.durations = horses.value.map((h) => estimateFinishTime(h))
    }

    const impliedStartTimestamps = progressPercentages.value.map(
      (percent, i) => now - (percent / 100) * (raceTiming.value.durations[i] * 1000),
    )

    raceTiming.value.startTimestamp = Math.min(...impliedStartTimestamps)
  }

  const startTime = raceTiming.value.startTimestamp ?? Date.now()

  timer = window.setInterval(() => {
    const elapsed = (Date.now() - startTime) / 1000
    let allDone = true

    progressPercentages.value = progressPercentages.value.map((current, i) => {
      const total = raceTiming.value.durations[i] || 5
      const percent = Math.min((elapsed / total) * 100, 100)
      if (percent < 100) allDone = false
      return Math.max(current, percent)
    })

    if (allDone) {
      stopRace()
      finalizeRace(raceTiming.value.durations)
    }
  }, 30)
}

const stopRace = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

const estimateFinishTime = (horse: Horse): number => {
  const condition = Math.max(horse?.condition ?? 1, 1)
  const randomness = 0.7 + Math.random() * 0.6
  const baseSpeed = 3
  const maxDuration = 20

  let seconds = raceDistance.value / (condition * randomness * baseSpeed)
  seconds = Math.max(3, Math.min(seconds, maxDuration))
  return seconds
}

const finalizeRace = (raceDurations: number[]) => {
  const standings = horses.value
    .map((h, i) => ({ horse: h, time: raceDurations[i] }))
    .sort((a, b) => a.time - b.time)
    .map((r) => r.horse)

  store.dispatch('race/finishRace', {
    round: store.state.race.currentLap.round,
    standing: standings,
  })
}

onMounted(async () => {
  await nextTick()
  trackWidths.value = trackRefs.value.map((el) => el?.offsetWidth || 0)
})

onBeforeUnmount(() => {
  stopRace()
  window.removeEventListener('race:nextRoundStarted', handleNextRound)
})

const formatRound = (round: number) => {
  if (round === 1) return 'st'
  if (round === 2) return 'nd'
  if (round === 3) return 'rd'
  return 'th'
}

watch(isRaceInProgress, (running) => {
  if (running) {
    const hasProgress = progressPercentages.value.some((p: number) => p > 0)
    startRace({ shouldResume: hasProgress })
  } else {
    stopRace()
  }
})
</script>
