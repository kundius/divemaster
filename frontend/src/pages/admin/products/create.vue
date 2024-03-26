<template>
  <div>
    <admin-page-header :title="$t('models.product.title_one')">
      <template #actions>
        <nuxt-link :to="`/${url}`">
          <ui-button variant="secondary">{{ $t('actions.cancel') }}</ui-button>
        </nuxt-link>
        <ui-button @click="form.submit()">{{ $t('actions.save') }}</ui-button>
      </template>
    </admin-page-header>
    <vesp-form ref="form" method="put" :url="url" :schema="schema" :initial-values="record" @success="onSuccess">
      <template #form-fields>
        <forms-product />
      </template>
    </vesp-form>
  </div>
</template>

<script setup lang="ts">
import { boolean, number, object, string } from 'yup'
import type { VespUser } from '@/types'

const url = `admin/products`
const form = ref()
const schema = markRaw(
  object({
    title: string().required(),
    description: string(),
    sku: string().required(),
    price: number().required(),
    category_id: number().required(),
    active: boolean().required(),
  })
)
const record = ref({
  title: '',
  active: true,
  description: '',
  sku: '',
  price: undefined,
  category_id: undefined
})

function onSuccess(data: VespUser) {
  navigateTo(`/${url}/${data.id}/edit`)
}
</script>
