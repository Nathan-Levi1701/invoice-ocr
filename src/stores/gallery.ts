import { deleteObject, ref as firebaseRef, getBlob, getDownloadURL, getStorage, listAll, uploadBytes, getMetadata, UploadResult, list } from 'firebase/storage'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { useSnackbarStore } from './snackbar';
import { useLoaderStore } from './loader';
import { Query, addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, limit, orderBy, query, startAfter, updateDoc } from 'firebase/firestore';
import _ from 'lodash';
import { firebase } from '~/modules/firebase';
import imageCompression from 'browser-image-compression';
import { blobToWebP } from 'webp-converter-browser'

const snackbarStore = useSnackbarStore();
const storage = getStorage(firebase, 'gs://rotek-gallaries');
const loaderStore = useLoaderStore();
const db = getFirestore();

export const useGalleryStore = defineStore('gallery', {
  state: () => ({
    selectedAlbum: {} as Album,
    galleries: [] as Array<Album>,
    nextPageToken: null,
    pageSize: 12,
    albumLimit: 5,
    hasMore: true,
    images: [] as Array<any>,
    lastVisible: null,
    hasMoreAlbums: true
  }),
  getters: {
    getSelectedAlbum(): Album {
      return this.selectedAlbum;
    }
  },
  actions: {
    async getPhotos(album: Album) {
      try {
        loaderStore.buttonLoading = true;

        const albumRef = firebaseRef(storage, album.id);

        const response = await list(albumRef, { maxResults: this.pageSize, pageToken: album.currentPageToken });

        const newImages: Array<{ url: string, file: File, dateUploaded: Date }> = await Promise.all(response.items.map(async (item: any) => {
          const [url, blob, metaData] = await Promise.all([getDownloadURL(item), getBlob(item), getMetadata(item)]);
          const file = new File([blob], item.name, { type: blob.type });
          return { url, file, dateUploaded: new Date(metaData.timeCreated) };
        }));

        await Promise.all(newImages.map((image: AlbumImage) => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = image.url;
            img.onload = resolve;
            img.onerror = reject;
          });
        })).then(() => {
          newImages.forEach((image: AlbumImage) => {
            (this.galleries.find((a: Album) => { return a.id === album.id }) as any).images.push(image);
          });

          album.currentPageToken = response.nextPageToken || null as any;
          this.hasMore = !!album.currentPageToken;
        })
      } catch (error) {
        snackbarStore.showSnackbar({ message: `${error}`, type: 'error' });
      } finally {
        loaderStore.buttonLoading = false;
      }
    },
    setSelectedAlbum(album: Album | string) {
      this.images = [];
      this.pageSize = 12;

      if (typeof album === 'string') {
        this.selectedAlbum = this.galleries.find((a: Album) => { return a.id === album }) as Album;
      } else {
        this.selectedAlbum = album;
      }

      this.hasMore = !!this.selectedAlbum.currentPageToken;
    },
    async getAlbums(enableLoading?: boolean) {
      try {
        if (enableLoading) {
          loaderStore.buttonLoading = true;
        }

        let q: Query;

        if (!this.lastVisible) {
          q = query(collection(db, 'gallery'), orderBy('dateCreated', 'desc'), limit(this.albumLimit));
        } else {
          q = query(collection(db, 'gallery'), orderBy('dateCreated', 'desc'), startAfter(this.lastVisible), limit(this.albumLimit));
        }

        const querySnapshot = await getDocs(q);

        if (querySnapshot.docs.length > 0) {
          for await (const doc of querySnapshot.docs) {
            const data = doc.data();

            const storageRef = firebaseRef(storage, doc.id);

            const { items, nextPageToken } = await list(storageRef, { maxResults: this.pageSize, pageToken: null });

            const images: Array<{ url: string, file: File, dateUploaded: Date }> = await Promise.all(items.map(async (item) => {
              const [url, blob, metaData] = await Promise.all([getDownloadURL(item), getBlob(item), getMetadata(item)]);
              const file = new File([blob], item.name, { type: blob.type });
              return { url, file, dateUploaded: new Date(metaData.timeCreated) };
            }));


            await Promise.all(images.map((image: AlbumImage) => {
              return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = image.url;
                img.onload = resolve;
                img.onerror = reject;
              });
            })).then(() => {
              images.sort((a, b) => { return a.dateUploaded.getTime() - b.dateUploaded.getTime() });
              this.galleries.push({ id: doc.id, title: data.title, description: data.description, dateCreated: data.dateCreated.toDate(), images, currentPageToken: nextPageToken });
              this.lastVisible = querySnapshot.docs.pop().data()['dateCreated'];
            });
          }
          // this.galleries.sort((a, b) => { return b.dateCreated.getTime() - a.dateCreated.getTime() });
        } else {
          this.hasMoreAlbums = false;
        }
      } catch (error) {
        loaderStore.disableLoading();
        snackbarStore.showSnackbar({ message: `${error}`, type: 'error' });
      } finally {
        loaderStore.buttonLoading = false;
      }
    },

    async getAlbum(albumId: string) {
      try {
        loaderStore.enableLoading();

        const album = await getDoc(doc(db, `gallery`, albumId));
        const data = album.data();

        if (album.exists()) {
          const storageRef = firebaseRef(storage, albumId);
          const { items, nextPageToken } = await list(storageRef, { maxResults: this.pageSize, pageToken: null });

          const images: Array<{ url: string, file: File, dateUploaded: Date }> = await Promise.all(items.map(async (item) => {
            const [url, blob, metaData] = await Promise.all([getDownloadURL(item), getBlob(item), getMetadata(item)])
            const file = new File([blob], item.name, { type: blob.type });
            return { url, file, dateUploaded: new Date(metaData.timeCreated) };
          }));

          images.sort((a, b) => { return b.dateUploaded.getTime() - a.dateUploaded.getTime() });

          this.selectedAlbum = { id: albumId, title: data?.title, description: data?.description, images, dateCreated: data?.dateCreated.toDate(), currentPageToken: nextPageToken };
        }
      } catch (error) {
        snackbarStore.showSnackbar({ message: `${error}`, type: 'error' });
      } finally {
        loaderStore.disableLoading();
      }
    },

    async addAlbum(album: Album) {
      try {
        const data: any = {
          title: album.title,
          description: album.description,
          dateCreated: new Date()
        };

        const response = await addDoc(collection(db, 'gallery'), data);

        if (album.images.length > 0) {
          await Promise.all(album.images.map(async (image: { url: string, file: File } | File) => {
            let uploadImage: File | Blob = image as File;

            if (uploadImage.type.includes('image')) {
              let imageName: string = (image as File).name;

              if ((image as File).type !== 'image/webp') {
                uploadImage = await this.convertToWebP(image as File);
                imageName = (image as File).name.replace(/\.[0-9a-z]+$/i, ".webp")
              }

              const imageRef = firebaseRef(storage, `${response.id}/${imageName}`);
              return uploadBytes(imageRef, uploadImage);
            } else {
              throw Error('Invalid file type uploaded');
            }
          }));
        }

        await this.getAlbum(response.id);

        this.galleries.unshift(this.selectedAlbum);

        snackbarStore.showSnackbar({ message: 'New Album Added Successfully', type: 'success' });

      } catch (error) {
        snackbarStore.showSnackbar({ message: `${error}`, type: 'error' });
      }
    },

    async editAlbum(album: Album) {
      try {
        loaderStore.enableLoading();

        const data: any = {
          title: album.title,
          description: album.description
        };

        await updateDoc(doc(db, `gallery/${album.id}`), data);

        (this.galleries.find((a: Album) => { return a.id === album.id }) as any).title = album.title;
        (this.galleries.find((a: Album) => { return a.id === album.id }) as any).description = album.description;

        if (album.images.length > 0) {
          const storageResults: Array<UploadResult> = await Promise.all(album.images.map(async (image: { url: string, file: File } | File) => {

            let uploadImage: File | Blob = image as File;

            if (uploadImage.type.includes('image')) {
              let imageName: string = (image as File).name;

              if ((image as File).type !== 'image/webp') {
                uploadImage = await this.convertToWebP(image as File);
                imageName = (image as File).name.replace(/\.[0-9a-z]+$/i, ".webp")
              }

              const imageRef = firebaseRef(storage, `${album.id}/${imageName}`);
              return uploadBytes(imageRef, uploadImage);
            } else {
              throw Error('Invalid file type uploaded');
            }
          }));

          const storageRefs = storageResults.map((storageResult) => { return storageResult.ref });

          const newImages: Array<AlbumImage> = [];

          for await (const storageRef of storageRefs) {
            const [url, blob, metaData] = await Promise.all([getDownloadURL(storageRef), getBlob(storageRef), getMetadata(storageRef)]);
            const file = new File([blob], storageRef.name, { type: blob.type });
            newImages.push({ url, file, dateUploaded: new Date(metaData.timeCreated) });
          }

          const currentImages = _.cloneDeep(this.galleries.find((a: Album) => { return a.id === album.id })?.images as Array<AlbumImage>);
          this.pageSize = this.pageSize + currentImages.length;

          Promise.all(newImages.map((image: AlbumImage) => {
            return new Promise((resolve, reject) => {
              const img = new Image();
              img.src = image.url;
              img.onload = resolve;
              img.onerror = reject;
            });
          })).then((image: any) => {
            (this.galleries.find((a: Album) => { return a.id === album.id }) as any).images.push(image);
            (this.galleries.find((a: Album) => { return a.id === album.id }) as any).images = [...newImages, ...currentImages].sort((a: AlbumImage, b: AlbumImage) => { return a.dateUploaded.getTime() - b.dateUploaded.getTime() });
            this.galleries = [...this.galleries];
          });
        }
        snackbarStore.showSnackbar({ message: 'Album Updated Successfully', type: 'success' });

      } catch (error) {
        snackbarStore.showSnackbar({ message: `${error}`, type: 'error' });
      } finally {
        loaderStore.disableLoading();
      }
    },

    async deleteAlbum(albumId: string) {
      try {
        loaderStore.enableLoading();

        await deleteDoc(doc(db, `gallery/${albumId}`));

        const albumRef = firebaseRef(storage, albumId);
        const imageList = await listAll(albumRef);

        await Promise.all(imageList.items.map(async (item) => {
          return deleteObject(item)
        }));

        const albumIndex = this.galleries.findIndex((album: Album) => { return album.id === albumId });
        this.galleries.splice(albumIndex, 1);

        snackbarStore.showSnackbar({ message: 'Album Deleted Successfully', type: 'success' });
      } catch (error) {
        snackbarStore.showSnackbar({ message: `${error}`, type: 'error' });
      } finally {
        loaderStore.disableLoading();
      }
    },

    async deletePhoto(input: any) {
      try {
        const { album, image, imageIndex } = input;

        loaderStore.enableLoading();

        const imageRef = firebaseRef(storage, `${album.id}/${image.file.name}`);
        await deleteObject(imageRef);

        this.galleries.find((a: Album) => { return a.id === album.id })?.images.splice(imageIndex, 1);

        snackbarStore.showSnackbar({ message: 'Photo Deleted Successfully', type: 'success' });
      } catch (error) {
        snackbarStore.showSnackbar({ message: `${error}`, type: 'error' });
      } finally {
        loaderStore.disableLoading();
      }
    },

    compressImage(image: File): Promise<File> {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      return imageCompression(image, options);
    },

    convertToWebP(image: File): Promise<Blob> {
      const blob = new Blob([image], { type: image.type });
      return blobToWebP(blob, { quality: 80 });
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGalleryStore as any, import.meta.hot))
}
