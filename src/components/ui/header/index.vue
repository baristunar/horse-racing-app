<template>
  <header class="header">
    <nav class="header__nav">
      <router-link class="header__nav-link" to="/"><h1>Horse Racing App</h1></router-link>
    </nav>
  </header>
</template>

<script setup lang="ts">
import './styles.scss'

defineOptions({
  name: 'AppHeader',
})
</script>
