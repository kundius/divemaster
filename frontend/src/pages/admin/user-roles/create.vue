<template>
  <div>
    <admin-page-header :title="$t('models.user_role.title_one')">
      <template #actions>
        <ui-button @click="form.onSubmit()">Сохранить</ui-button>
      </template>
    </admin-page-header>
    <vesp-form ref="form" url="admin/user-roles" method="put" :schema="schema" :initial-values="initialValues">
      <template #form-fields>
        <forms-user-role />
      </template>
    </vesp-form>
  </div>
</template>

<script setup lang="ts">
import { markRaw } from 'vue'
import { object, string } from 'yup'

const form = ref()
const schema = markRaw(object({ title: string().required() }))
const initialValues = markRaw({
  id: 0,
  title: '',
  scope: []
})
</script>
