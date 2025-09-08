<template>
  <AppHeader />
  <section class="homepage">
    <ActionArea />
    <section class="homepage__body">
      <HorseList v-if="isProgramGenerated" />
      <RaceTrack v-if="isProgramGenerated" />
      <RaceProgram v-if="isProgramGenerated" />
    </section>
  </section>
</template>

<script setup lang="ts">
import './styles.scss'
import AppHeader from '@components/ui/header/index.vue'
import HorseList from '@components/horse-list/index.vue'
import RaceTrack from '@components/race-track/index.vue'
import ActionArea from '@components/action-area/index.vue'
import RaceProgram from '@components/race-program/index.vue'
import { useStore } from 'vuex'
import { computed } from 'vue'

defineOptions({
  name: 'HomepageIndex',
})

const store = useStore()

const isProgramGenerated = computed(() => store.state.horses.data.length > 0)
</script>
