import { acceptHMRUpdate, defineStore } from 'pinia'
import { collection, getDocs, getFirestore, orderBy, query, where } from 'firebase/firestore'
import { ref } from 'vue'
import { useLoaderStore } from './loader';
import { useSnackbarStore } from './snackbar';

export const useProductStore = defineStore('catalogue', () => {
  const loaderStore = useLoaderStore();
  const snackbarStore = useSnackbarStore();

  const products = ref<any>({})
  const order = ref<Array<any>>([])

  const db = getFirestore()

  const updateOrder = (item: any) => {
    const currentIndex = order.value.findIndex((i) => { return i.name === item.name && i.weight === item.weight })

    item.total = item.price * item.quantity

    if (currentIndex > -1) {
      order.value.splice(currentIndex, 1, item);
    }
  }

  const addToOrder = (item: any) => {
    const currentIndex = order.value.findIndex((i) => { return i.name === item.name && i.weight === item.weight })

    if (currentIndex > -1) {
      ++order.value[currentIndex].quantity;
      order.value[currentIndex].total = order.value[currentIndex].price * order.value[currentIndex].quantity;
    }
    else {
      item.quantity = 1
      item.total = item.price;
      order.value.push(item)
    }
  }

  const removeFromOrder = (index: number) => {
    order.value.splice(index, 1);
  }

  const getProducts = async (brand: string, name: string) => {
    try {
      loaderStore.enableLoading();

      const range: Array<any> = [];

      if (!Object.keys(products.value).includes(name)) {
        const q = query(collection(db, 'catalogue'), where('brand', '==', brand), where('name', '==', name), orderBy('range', 'asc'), orderBy('price', 'asc'));

        const querySnapshot = await getDocs(q);

        for await (const doc of querySnapshot.docs) {
          const response = doc.data();
          range.push(response);
        }

        products.value[name] = range;
      }
    } catch (error) {
      console.log(error)
      snackbarStore.showSnackbar({ message: `${error}`, type: 'error' });
    } finally {
      loaderStore.disableLoading();
    }
  }
  return {
    getProducts,
    addToOrder,
    removeFromOrder,
    updateOrder,
    products,
    order,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProductStore as any, import.meta.hot))
}
