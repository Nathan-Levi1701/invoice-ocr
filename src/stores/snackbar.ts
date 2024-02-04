import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'

interface Snackbar {
  message?: string
  type?: 'success' | 'warning' | 'error'
}

export const useSnackbarStore = defineStore('snackbar', () => {
  const content = ref<Snackbar | undefined>({})
  const state = ref<boolean>(false)

  const showSnackbar = (input: Snackbar) => {
    content.value!.message = input.message
    content.value!.type = input.type

    state.value = true

    // setTimeout(() => {
    // state.value = false
    // }, 2500)
  }

  const closeSnackbar = () => {
    state.value = false
  }

  return {
    showSnackbar,
    closeSnackbar,
    content,
    state,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSnackbarStore as any, import.meta.hot))
}
