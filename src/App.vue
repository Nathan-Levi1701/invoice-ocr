<script setup lang="ts">
import { useHead } from '@vueuse/head'
import '/src/styles/styles.css'
import '/src/styles/tailwind.css'

useHead({
  meta: [
    { name: 'Accept-Encoding', content: 'gzip' },
    { name: 'Content-Encoding', content: 'gzip' },
  ],
})

</script>

<template>
  <v-app>
    <router-view />
    <LoaderOverlay></LoaderOverlay>
  </v-app>
</template>

<style lang="scss">
.page_content {
  @apply mx-auto xl:w-3/4 py-5 sm:py-16 my-5;
}
</style>
