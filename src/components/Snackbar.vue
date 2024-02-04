<script setup lang="ts">
import { ref, watch } from 'vue'
import { useSnackbarStore } from '~/stores/snackbar'

interface Props {
  state: boolean
}

const props = withDefaults(defineProps<Props>(), {
  state: false,
})

const emit = defineEmits<{ (e: 'close', dialog: boolean): void }>()

const state = ref<boolean>(false)

const useSnackbar = useSnackbarStore()

watch(() => [props.state], () => {
  state.value = props.state
})
</script>

<template>
  <v-snackbar v-model="state" class="absolute" :color="useSnackbar.content?.type">
    {{ useSnackbar.content?.message }}
    <template #actions>
      <v-btn variant="text"
             @click="useSnackbar.closeSnackbar"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>
