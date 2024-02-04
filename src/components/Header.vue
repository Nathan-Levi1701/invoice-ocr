<script setup lang="ts">
import logo from '/assets/logo.png'

</script>

<template>
  <header class="border-b">
    <v-toolbar color="background">
      <div class="v-toolbar__prepend">
        <!-- <v-app-bar-nav-icon class="xl:hidden mr-3" @click="emit('toggle', props.toggle)">
          <icon-mdi-menu v-if="!props.toggle" class="icon" />
          <icon-mdi-close v-if="props.toggle" class="icon" />
        </v-app-bar-nav-icon> -->
        <router-link :style="{ height: '60%', width: 'auto' }" :to="{ path: '/' }">
          <img class="h-full w-auto hidden xxs:block" :src="logo" alt="">
        </router-link>
        <h5 class="ml-6 text-h5 text-black font-bold">
          Invoice OCR Tool
        </h5>
      </div>
    </v-toolbar>
  </header>
</template>

<style lang="scss" scoped>
.v-toolbar {
  @apply items-center;

  :deep(.v-toolbar__content) {
    height: 86px !important;
    @apply py-3 px-3;
    @apply justify-between max-w-screen-2xl mx-auto;

    .v-toolbar__prepend {
      @apply h-full;
    }

    .v-toolbar__append>.v-btn {
      @apply mx-1;
    }
  }
}

.v-toolbar__content>.v-btn:first-child {
  margin-inline-start: 0;
  margin-inline-end: 10px;
}

.v-toolbar__content .v-btn {
  height: 36px !important;
  border-radius: 6px;
}

:deep(.router-link) {
  font-weight: 600 !important;
}

.toolbar-menu {
  :deep(.v-menu .v-overlay__container) {
    left: 120px !important;
  }
}

.v-menu .v-overlay__content>.v-list {
  .v-list-item {
    .v-list-item-title {
      font-size: 0.875rem;
      letter-spacing: 0.0892857143em;
    }
  }
}

.v-btn {
  color: white;
  border-radius: 0;
  widows: 100%;
  text-align: left;
}

.icon {
  @apply h-6 w-6;
}

.displayName {
  font-size: 0.875rem;
  letter-spacing: 0.0892857143em;
  font-weight: 500;
}
</style>
