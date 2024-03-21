<template>
  <button
    class="inline-flex items-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-neutral-50 hover:text-neutral-800 px-3 py-2 relative h-10 w-full justify-start rounded-lg bg-white text-sm font-normal text-neutral-600 shadow-none sm:pr-16 md:w-64 lg:w-80"
  >
    <span class="hidden lg:inline-flex">Найти что-нибудь...</span>
    <span class="inline-flex lg:hidden">Поиск...</span>
    <div class="gap-1 pointer-events-none absolute right-[0.5rem] top-[0.5rem] hidden sm:flex">
      <ui-badge variant="secondary">Ctrl+K</ui-badge>
    </div>
  </button>
</template>

<script setup lang="ts">
</script>
