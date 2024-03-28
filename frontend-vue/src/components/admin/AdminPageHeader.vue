<template>
  <div class="flex items-center justify-between flex-wrap gap-4 mb-8">
    <h1 class="scroll-m-20 text-4xl font-medium tracking-tight">
      {{ title }}
      <slot name="title" />
    </h1>
    <div class="flex items-center flex-wrap gap-3">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>
