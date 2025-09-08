<template>
  <table class="ui-table">
    <thead>
      <tr>
        <th v-for="(col, index) in head" :key="index">
          {{ col }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, rowIndex) in body" :key="rowIndex">
        <td v-for="(cell, cellIndex) in row" :key="cellIndex">
          {{ cell }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import './styles.scss'

defineOptions({
  name: 'UiTable',
})
defineProps<{
  head: string[]
  body: Array<(string | number)[]>
}>()
</script>
