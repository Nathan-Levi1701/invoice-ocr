<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useLoaderStore } from '~/stores/loader';

const loaderStore = useLoaderStore();
const { loading } = storeToRefs(loaderStore);

</script>

<template>
    <v-overlay class="align-center justify-center" :model-value="loading" :close-on-content-click="false" :close-on-back="false" persistent>
        <v-progress-circular color="primary" indeterminate :size="110" :width="10"></v-progress-circular>
    </v-overlay>
</template>