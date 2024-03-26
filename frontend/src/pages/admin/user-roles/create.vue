<template>
  <div>
    <admin-page-header :title="$t('models.user_role.title_one')">
      <template #actions>
        <nuxt-link :to="`/${url}`">
          <ui-button variant="secondary">Отмена</ui-button>
        </nuxt-link>
        <ui-button @click="form.submit()">Сохранить</ui-button>
      </template>
    </admin-page-header>
    <vesp-form ref="form" method="put" :url="url" :schema="schema" :initial-values="record" @success="onSuccess">
      <template #form-fields>
        <forms-user-role />
      </template>
    </vesp-form>
  </div>
</template>

<script setup lang="ts">
import { object, string } from 'yup'
import type { VespUserRole } from '@/types'

const url = `admin/user-roles`
const form = ref()
const schema = markRaw(object({ title: string().required() }))
const record = ref({
  title: '',
  scope: []
})

function onSuccess(data: VespUserRole) {
  navigateTo(`/${url}/${data.id}/edit`)
}
</script>
