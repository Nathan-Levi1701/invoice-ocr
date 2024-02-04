<script setup lang="ts">
import { ref, watch } from 'vue'

const p = withDefaults(defineProps<Props>(), {
  toggle: false,
})

const training = [
  { title: 'Tracking', path: '/training/tracking' },
  { title: 'Obedience', path: '/training/obedience' },
  { title: 'Protection', path: '/training/protection' },
]

interface Props {
  toggle: boolean
}

const toggle = ref<boolean>(false)

watch(() => p.toggle, () => {
  toggle.value = p.toggle
})

const emit = defineEmits<{ (e: 'toggle', toggle: boolean): void }>()
</script>

<template>
  <v-navigation-drawer v-model="toggle" temporary location="top" :style="{ height: 'auto', maxHeight: '90vh' }"
    class="bg-primary p-3">
    <v-list class="text-caption" density="compact" nav>
      <v-list-item :to="{ path: '/' }" @click="emit('toggle', toggle)">
        Home
      </v-list-item>

      <v-list-item :to="{ path: '/training' }" @click="emit('toggle', toggle)">
        Training
      </v-list-item>

      <div class="ml-4">
        <v-list-item :to="{ path: '/training/tracking' }" @click="emit('toggle', toggle)">
          Tracking
        </v-list-item>

        <v-list-item :to="{ path: '/training/obedience' }" @click="emit('toggle', toggle)">
          Obedience
        </v-list-item>

        <v-list-item :to="{ path: '/training/protection' }" @click="emit('toggle', toggle)">
          Protection
        </v-list-item>

        <v-list-item :to="{ path: '/training/about-igp' }" @click="emit('toggle', toggle)">
          About IGP
        </v-list-item>
      </div>

      <v-list-item :to="{ path: '/information/breeding' }" @click="emit('toggle', toggle)">
        Breeding
      </v-list-item>

      <v-list-item :to="{ path: '/information/membership' }" @click="emit('toggle', toggle)">
        Memembership
      </v-list-item>

      <v-list-item :to="{ path: '/information/sponsors' }" @click="emit('toggle', toggle)">
        Sponsers
      </v-list-item>

      <v-list-item :to="{ path: '/events' }" @click="emit('toggle', toggle)">
        Events
      </v-list-item>

      <v-list-item :to="{ path: '/catalogues' }" @click="emit('toggle', toggle)">
        Catalogues
      </v-list-item>

      <v-list-item :to="{ path: '/gallery' }" @click="emit('toggle', toggle)">
        Gallery
      </v-list-item>

      <v-list-item :to="{ path: '/contact' }" @click="emit('toggle', toggle)">
        Contact Us
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<style lang="scss" scoped></style>
