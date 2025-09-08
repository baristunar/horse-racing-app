<template>
  <button @click="handleClick" class="ui-button"><slot /></button>
</template>

<script setup lang="ts">
import './styles.scss'

defineOptions({
  name: 'UiButton',
})

defineProps<{
  handleClick: (event: MouseEvent) => void
}>()
</script>
