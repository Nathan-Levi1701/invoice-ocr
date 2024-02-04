<script setup lang="ts">
import { ref } from 'vue'

const toggle = ref<boolean>(false)
</script>

<template>
  <Header :toggle="toggle" @toggle="toggle = !toggle"/>
  <v-layout :style="{ height: '100%', background: 'whitesmoke' }">
    <NavigationDrawer :toggle="toggle" @toggle="toggle = !toggle"/>
    <v-main>
      <router-view />
    </v-main>
  </v-layout>

  <Footer />
</template>

<style lang="scss">
.page {
  @apply container mx-auto flex;

  .content {
    @apply mx-auto xl:w-3/4 py-5 sm:py-16 my-5 px-5 md:px-10;
  }
}
</style>
