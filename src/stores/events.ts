import { acceptHMRUpdate, defineStore } from 'pinia'
import { useSnackbarStore } from './snackbar';
import type Event from '../interfaces/Event.interface'
import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, orderBy, query, updateDoc } from 'firebase/firestore';
import { deleteObject, getBlob, getDownloadURL, getStorage, list, listAll, ref, uploadBytes } from 'firebase/storage';
import { useLoaderStore } from './loader';
import _ from 'lodash';
import { firebase } from '~/modules/firebase';

const snackbarStore = useSnackbarStore();
const loaderStore = useLoaderStore();

const db = getFirestore();
const storage = getStorage(firebase, 'rotek-events');

export const useEventStore = defineStore('event', {
  state: () => ({
    loading: false,
    events: [] as Array<Event>,
    eventsInMonth: [] as Array<Event>,
  }),
  actions: {
    getEventsInMonth(month: number) {
      this.eventsInMonth = this.events.filter((event: Event) => { return event.dates.start.getMonth() == month && event.dates.end.getMonth() == month });
    },
    async getEvents() {
      try {
        loaderStore.enableLoading();

        const q = query(collection(db, 'events'), orderBy('dates', 'desc'));
        const querySnapshot = await getDocs(q);

        const events: Array<Event> = [];

        for await (const doc of querySnapshot.docs) {
          const data = doc.data();

          const storageRef = ref(storage, doc.id);
          const fileList = await list(storageRef);

          let url: string = '';
          let blob: Blob;
          let file: any;

          if (fileList.items.length > 0) {
            const fileRef = ref(storage, `${doc.id}/${fileList.items[0].name}`);
            [url, blob] = await Promise.all([getDownloadURL(fileRef), getBlob(fileRef)]);
            file = new File([blob], fileRef.name, { type: blob.type });
          }

          const event: Event = {
            id: doc.id,
            title: data.title,
            description: data.description,
            color: data.color,
            highlight: { color: data.color.split('-')[1], class: 'event_highlight' },
            popover: {
              label: data.description,
            },
            dates: { start: data.dates.start.toDate(), end: data.dates.end.toDate() },
            eventSubTypes: data.eventSubTypes,
            eventType: data.eventType,
            file: { url, file }
          };

          events.push(event);
        }

        this.events = [...events.sort((a, b) => { return a.dates.start.getTime() - b.dates.end.getTime() })];
        this.eventsInMonth = [...events];
      } catch (error) {
        snackbarStore.showSnackbar({ message: `${error}`, type: 'error' });
      } finally {
        loaderStore.disableLoading();
      }
    },

    async addEvent(event: any) {
      try {
        loaderStore.enableLoading();

        const data: Event = {
          title: event.title,
          description: event.description,
          color: event.color,
          dates: event.dates,
          eventType: event.eventType,
          eventSubTypes: event.eventSubTypes,
        };

        const docRef = await addDoc(collection(db, 'events'), data);

        event.id = docRef.id;
        event.highlight = { color: data.color.split('-')[1], class: 'event_highlight' };
        event.popover = { label: event.description };

        if (event.file.length > 0) {
          const fileRef = ref(storage, `${docRef.id}/${event.file[0].name}`);
          await uploadBytes(fileRef, event.file[0] as File);
          event.file = { url: await getDownloadURL(fileRef), file: event.file[0] };
        }

        this.events.push(event)
        this.getEventsInMonth(event.dates.start.getMonth());

        snackbarStore.showSnackbar({ message: 'New Event Added Successfully', type: 'success' });
      } catch (error) {
        snackbarStore.showSnackbar({ message: `${error}`, type: 'error' });
      } finally {
        loaderStore.disableLoading();
      }
    },

    async editEvent(event: any) {
      try {
        loaderStore.enableLoading();

        const data: any = {
          title: event.title,
          description: event.description,
          color: event.color,
          dates: event.dates,
          eventType: event.eventType,
          eventSubTypes: event.eventSubTypes,
        };

        await updateDoc(doc(db, `events/${event.id}`), data);

        const eventRef = ref(storage, event.id);
        const imageList = await listAll(eventRef);

        await Promise.all(imageList.items.map(async (item) => {
          return deleteObject(item)
        }));

        if (event.file && event.file.length > 0) {
          const fileRef = ref(storage, `${event.id}/${event.file[0].name}`);
          await uploadBytes(fileRef, event.file[0]);

          event.file = { file: event.file[0], url: await getDownloadURL(fileRef) };
        }

        const index = this.events.findIndex((ev: Event) => { return ev.id === event.id });

        this.events.splice(index, 1, event);
        this.getEventsInMonth(event.dates.start.getMonth());

        snackbarStore.showSnackbar({ message: 'Event Updated Successfully', type: 'success' });
      } catch (error) {
        snackbarStore.showSnackbar({ message: `${error}`, type: 'error' });
      } finally {
        loaderStore.disableLoading();
      }
    },

    async deleteEvent(event: Event) {
      try {
        loaderStore.enableLoading();

        await deleteDoc(doc(db, `events/${event.id}`));

        const eventRef = ref(storage, event.id);
        const fileList = await listAll(eventRef);

        if (fileList.items.length > 0) {
          await Promise.all(fileList.items.map(async (item) => {
            return deleteObject(item)
          }));
        }

        this.events = this.events.filter((e: Event) => { return event.id !== e.id });
        this.getEventsInMonth(event!.dates.start.getMonth());

        snackbarStore.showSnackbar({ message: 'Event Deleted Successfully', type: 'success' });
      } catch (error) {
        snackbarStore.showSnackbar({ message: `${error}`, type: 'error' });
      } finally {
        loaderStore.disableLoading();
      }
    }
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useEventStore, import.meta.hot))
}
