import { acceptHMRUpdate, defineStore } from 'pinia'

export const useLoaderStore = defineStore('loader', {
  state: () => ({
    loading: false,
    buttonLoading: false,
  }),
  actions: {
    enableLoading() {
      this.loading = true;
    },
    disableLoading() {
      this.loading = false;
    }
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLoaderStore, import.meta.hot))
}
