<template>
  <div>
    <nuxt-page />
    <Toaster position="top-center" rich-colors close-button />
  </div>
</template>

<script lang="ts" setup>
import { Toaster } from '@/components/ui/sonner'
</script>

<style lang="scss">
:root {
  --font-sans: 'Roboto';
  --font-sans-narrow: 'Roboto Condensed';

  font-family: 'Roboto Condensed', sans-serif;
  font-family: 'Roboto', sans-serif;
}
</style>
