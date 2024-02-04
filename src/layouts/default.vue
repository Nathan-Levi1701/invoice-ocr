<script setup lang="ts">
import { ref } from 'vue'

const toggle = ref<boolean>(false)
</script>

<template>
  <Header @toggle="toggle = !toggle" />
  <v-layout :style="{ height: '100%' }">
    <NavigationDrawer :toggle="toggle" />
    <div class="container mx-auto flex h-full">
      <div class="mx-auto xl:w-3/4 py-5 px-5 md:px-10">
        <v-main>
          <router-view />
        </v-main>
      </div>
    </div>
  </v-layout>
  <Footer />
</template>

<style lang="scss" scoped>
</style>
