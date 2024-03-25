<template>
  <div>
    <admin-page-header :title="$t('models.category.title_one')">
      <template #actions>
        <nuxt-link :to="`/${url}`">
          <ui-button variant="secondary">{{ $t('actions.cancel') }}</ui-button>
        </nuxt-link>
        <ui-button @click="form.onSubmit()">{{ $t('actions.save') }}</ui-button>
      </template>
    </admin-page-header>
    <vesp-form ref="form" method="patch" :url="`${url}/${id}`" :schema="schema" :initial-values="record">
      <template #form-fields>
        <forms-category />
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
    active: boolean().required(),
  })
)
const record = ref({
  id: 0,
  active: true,
  title: '',
})

const id = useRoute().params.id
const url = `admin/categories`
try {
  record.value = await useGet(`${url}/${id}`)
} catch (e: any) {
  showError({ statusCode: e.statusCode, statusMessage: e.message })
}
</script>
