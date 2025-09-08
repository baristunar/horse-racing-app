<template>
  <section class="race-schedule__program">
    <h2 class="race-schedule__program-title">Program</h2>

    <div v-for="(program, idx) in raceProgram" :key="program.id ?? idx">
      <p class="race-schedule__text">
        {{ program.round }}{{ formatRound(program.round) }} Lap - {{ program.distance }}m
      </p>

      <Table :head="tableHead" :body="programTableBody(program.participants)" />
    </div>
  </section>
</template>

<script setup lang="ts">
import './styles.scss'
import { useStore } from 'vuex'
import { computed } from 'vue'
import { generateSchedule } from '@utils/helpers/generateSchedule'
import Table from '@components/ui/table/index.vue'
import type { Horse, RaceScheduleItem } from '@store/types'

defineOptions({
  name: 'RaceProgram',
})

const store = useStore()
const horses = computed(() => store.state.horses.data)

const raceProgram = computed(() => {
  const storeSchedule = (store.state.schedule?.data ?? []) as RaceScheduleItem[]

  if (storeSchedule && storeSchedule.length) return storeSchedule

  return generateSchedule({ horseList: horses.value })
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
