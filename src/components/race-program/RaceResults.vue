k
<template>
  <section class="race-schedule__results">
    <h2 class="race-schedule__results-title">Results</h2>

    <div class="race-schedule__results-item">
      <div v-for="(program, idx) in raceProgram" :key="program.id ?? idx">
        <p class="race-schedule__text">
          {{ program.round }}{{ formatRound(program.round) }} Lap - {{ program.distance }}m
        </p>

        <div v-if="raceResultsByRound[program.round]">
          <Table
            :head="tableHead"
            :body="programTableBody(raceResultsByRound[program.round].standing)"
          />
        </div>
        <div v-else>
          <p class="race-schedule__text --error">No results yet</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import './styles.scss'
import { useStore } from 'vuex'
import { computed } from 'vue'
import Table from '@components/ui/table/index.vue'
import type { Horse, RaceResultItem, RaceScheduleItem } from '@store/types'

defineOptions({
  name: 'RaceResults',
})

const store = useStore()
const raceResults = computed(() => store.state.results.data)

const raceResultsByRound = computed((): Record<number, RaceResultItem> => {
  const resultsByRoundMap: Record<number, RaceResultItem> = {}
  const arr = (raceResults.value ?? []) as RaceResultItem[]

  arr.forEach((item) => {
    if (item && typeof item.round === 'number') resultsByRoundMap[item.round] = item
  })

  return resultsByRoundMap
})

const raceProgram = computed(() => {
  const storeSchedule = (store.state.schedule?.data ?? []) as RaceScheduleItem[]

  if (storeSchedule && storeSchedule.length) return storeSchedule

  return [] as RaceScheduleItem[]
})

const tableHead = ['Position', 'Name']

const programTableBody = (participants: Horse[]) => {
  return participants.map((horse, index) => [index + 1, horse.name])
}

const formatRound = (round: number) => {
  if (round === 1) return 'st'
  if (round === 2) return 'nd'
  if (round === 3) return 'rd'
  return 'th'
}
</script>
