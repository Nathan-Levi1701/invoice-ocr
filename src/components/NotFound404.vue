<script setup lang="ts">
</script>

<template>
  <div class="page">
    <div class="content">
      <h4 class="font-bold mb-2 text-primary">
        404 ERROR
      </h4>
      <h2 class="text-4xl sm:text-5xl font-extrabold mb-3 text-left">
        Page not found
      </h2>
      <h4 class="mb-5">
        Sorry, we couldn't find the page you're looking for.
      </h4>
      <router-link :to="{ path: '/' }" class="text-primary font-bold">
        <p class="items-center">
          Go back home
          <icon-mdi:chevron-right class="text-primary text-lg h-6 w-6" />
        </p>
      </router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
p svg {
  @apply inline-block;
}
</style>
