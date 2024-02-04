import { acceptHMRUpdate, defineStore } from 'pinia'
import { addDoc, collection, getDocs, getFirestore, orderBy, query } from 'firebase/firestore'
import { ref } from 'vue'
import { useSnackbarStore } from './snackbar';

export const useMembershipStore = defineStore('membership', () => {
  const membershipForm = ref<any>();
  const fees = ref<Array<any>>([]);

  const db = getFirestore();

  const snackbarStore = useSnackbarStore();

  const getFees = async () => {
    console.log(fees.value.length)
    if (fees.value.length === 0) {
      try {
        const q = query(collection(db, 'fees'), orderBy('index', 'asc'));
        const querySnapshot = await getDocs(q);

        for (const doc of querySnapshot.docs) {
          const data = doc.data();
          fees.value.push(data);
        };
      }
      catch (error) {
        console.log(error)
        snackbarStore.showSnackbar({ message: `${error}`, type: 'error' });
      }
    }
  }

  return {
    getFees,
    membershipForm,
    fees
  }
})


if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMembershipStore as any, import.meta.hot))
}
