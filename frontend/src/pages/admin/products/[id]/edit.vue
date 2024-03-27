<template>
  <vesp-form method="patch" :url="`${url}/${record.id}`" :schema="schema" :initial-values="record">
    <template #form-fields>
      <forms-product-edit />
    </template>
  </vesp-form>
</template>

<script setup lang="ts">
import { boolean, number, object, string } from 'yup'
import type { VespProduct } from '~/types'

const url = `admin/products`
const { record } = useAttrs() as { record: VespProduct }
const schema = markRaw(
  object({
    title: string().required(),
    description: string(),
    sku: string().required(),
    price: number().required(),
    category_id: number().required(),
    active: boolean().required()
  })
)
</script>
