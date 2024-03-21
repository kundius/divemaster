<template>
  <div class="flex p-4 gap-2 justify-center">
    <NuxtLink to="/admin">
      <ui-button variant="outline">Admin</ui-button>
    </NuxtLink>
    <NuxtLink to="/signin">
      <Button variant="secondary">Sign In</Button>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
</script>
