<template>
  <section class="race-schedule">
    <RaceProgram />
    <RaceResults />
  </section>
</template>

<script setup lang="ts">
import './styles.scss'
import RaceProgram from '@/components/race-program/RaceProgram.vue'
import RaceResults from '@/components/race-program/RaceResults.vue'

defineOptions({
  name: 'RaceSchedule',
})
</script>
