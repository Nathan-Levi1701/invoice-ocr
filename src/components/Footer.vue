<script setup lang="ts">
</script>

<template>
  <v-footer class="flex flex-column w-full" color="secondary">
    <div class="w-full">
      <div class="footer-lower">
          <div class="col md:text-right">
          <span class="text-body-2">
            Website by Nathan Levi
          </span>
        </div>
      </div>
    </div>
  </v-footer>
</template>

<style lang="scss" scoped>
.v-footer {
  border-top: 1px solid #e6e6e4;
  @apply block p-0;

  .footer-upper {
    @apply py-4 pl-4;
    @apply  justify-between max-w-screen-2xl mx-auto;
    @apply flex flex-wrap flex-row items-center;
  }

  .footer-lower {
    @apply p-4;
    @apply justify-between max-w-screen-2xl mx-auto items-center;
    @apply text-center grid grid-cols-1 gap-2 md:grid-cols-3
  }

  .col {
    @apply flex flex-col px-3;
  }
}
.icon {
  font-size: 1.5rem;
}

.list-quick-items {
  @apply bg-transparent p-0;

  :deep(.v-list-item) {
    @apply pl-0 min-h-0 w-full;
  }
}
</style>
