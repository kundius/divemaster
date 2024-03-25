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
    <vesp-form ref="form" method="put" :url="url" :schema="schema" :initial-values="record" @success="onSuccess">
      <template #form-fields>
        <forms-product />
      </template>
    </vesp-form>
  </div>
</template>

<script setup lang="ts">
import { number, object, string } from 'yup'
import type { VespUser } from '@/types'

const url = `admin/products`
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

function onSuccess(data: VespUser) {
  navigateTo(`/${url}/${data.id}/edit`)
}
</script>
