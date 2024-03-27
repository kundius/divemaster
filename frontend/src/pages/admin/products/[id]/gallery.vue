<template>
  <forms-product-gallery :product-id="record.id" />
</template>

<script setup lang="ts">
import type { VespProduct } from '~/types'

const { record } = useAttrs() as { record: VespProduct }
</script>
