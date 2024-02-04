<route lang="yaml">
    meta:
        layout: blank
</route>
    
<script setup lang="ts">
import { useHead } from '@vueuse/head'

useHead({
    title: 'Rotek Dog Club | Page Not Found',
    meta: [{ name: 'description', content: 'Home Description' },
    { name: 'robots', content: 'noindex' }]
})
</script>
    
<script lang="ts">
</script>
    
<template>
    <NotFound404 />
</template>
    