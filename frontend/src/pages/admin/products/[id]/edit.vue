<template>
  <div>
    <admin-page-header :title="$t('models.product.title_one')">
      <template #actions>
        <nuxt-link :to="`/${url}`">
          <ui-button variant="secondary">{{ $t('actions.cancel') }}</ui-button>
        </nuxt-link>
        <ui-button @click="form.onSubmit()">{{ $t('actions.save') }}</ui-button>
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
import { number, object, string } from 'yup'

const form = ref()
const schema = markRaw(
  object({
    title: string().required(),
  })
)
const record = ref({
  id: 0,
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
