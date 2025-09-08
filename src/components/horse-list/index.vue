<template>
  <section class="horse-list">
    <h2>Horse List</h2>

    <section class="horse-list__wrapper">
      <Table :head="tableHead" :body="tableBody" />
    </section>
  </section>
</template>

<script setup lang="ts">
import './styles.scss'
import { useStore } from 'vuex'
import { computed } from 'vue'
import Table from '@components/ui/table/index.vue'
import type { Horse } from '@store/types'

defineOptions({
  name: 'HorseList',
})

const store = useStore()
const horses = computed(() => store.state.horses.data)
const tableHead = ['Name', 'Condition', 'Color']
const tableBody = computed(() =>
  horses.value.map((h: Horse) => [h.name, h.condition, h.color.name]),
)
</script>
