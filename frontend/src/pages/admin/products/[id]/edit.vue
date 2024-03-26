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
    <vesp-form ref="form" method="patch" :url="`${url}/${id}`" :schema="schema" :initial-values="record">
      <template #form-fields>
        <forms-product />
      </template>
    </vesp-form>
  </div>
</template>

<script setup lang="ts">
import { boolean, number, object, string } from 'yup'

const form = ref()
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
const record = ref({
  title: '',
})

const id = useRoute().params.id
const url = `admin/products`
try {
  record.value = await useGet(`${url}/${id}`)
} catch (e: any) {
  showError({ statusCode: e.statusCode, statusMessage: e.message })
}
</script>
