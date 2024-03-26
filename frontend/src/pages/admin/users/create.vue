<template>
  <div>
    <admin-page-header :title="$t('models.user.title_one')">
      <template #actions>
        <nuxt-link :to="`/${url}`">
          <ui-button variant="secondary">Отмена</ui-button>
        </nuxt-link>
        <ui-button @click="form.submit()">Сохранить</ui-button>
      </template>
    </admin-page-header>
    <vesp-form ref="form" method="put" :url="url" :schema="schema" :initial-values="record" @success="onSuccess">
      <template #form-fields>
        <forms-user />
      </template>
    </vesp-form>
  </div>
</template>

<script setup lang="ts">
import { number, object, string } from 'yup'
import type { VespUser } from '@/types'

const url = `admin/users`
const form = ref()
const schema = markRaw(
  object({
    email: string().required(),
    username: string().required(),
    fullname: string().required(),
    password: string().required(),
    role_id: number().required()
  })
)
const record = ref({
  email: '',
  username: '',
  fullname: '',
  password: '',
  role_id: undefined
})

function onSuccess(data: VespUser) {
  navigateTo(`/${url}/${data.id}/edit`)
}
</script>
