<template>
  <div class="relative">
    <slot></slot>
    <div v-if="show" class="left-0 top-0 right-0 bottom-0 absolute bg-white opacity-50 z-10"></div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  show: {
    type: Boolean,
    default: false
  }
})
</script>
