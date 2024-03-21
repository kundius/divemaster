<template>
  <div>
    <nuxt-page />
    <Toaster position="top-center" rich-colors close-button />
  </div>
</template>

<script lang="ts" setup>
import { Toaster } from 'vue-sonner'

const appConfig = useAppConfig()

console.log(appConfig.theme)
</script>

<style lang="scss">
:root {
  --font-sans: 'Roboto';
  --font-sans-alt: 'Roboto Condensed';

  font-family: 'Roboto Condensed', sans-serif;
  font-family: 'Roboto', sans-serif;
}
</style>
