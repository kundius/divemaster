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
    <vesp-form ref="form" method="patch" :url="`${url}/${id}`" :schema="schema" :initial-values="record">
      <template #form-fields>
        <forms-user />
      </template>
    </vesp-form>
  </div>
</template>

<script setup lang="ts">
import { number, object, string } from 'yup'

const form = ref()
const schema = markRaw(
  object({
    email: string().required(),
    username: string().required(),
    fullname: string().required(),
    password: string(),
    role_id: number().required()
  })
)
const record = ref({
  email: '',
  username: '',
  fullname: '',
  password: '',
  role_id: 0
})

const id = useRoute().params.id
const url = `admin/users`
try {
  record.value = await useGet(`${url}/${id}`)
  console.log(record.value)
} catch (e: any) {
  showError({ statusCode: e.statusCode, statusMessage: e.message })
}
</script>
