<template>
  <div>
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="Email" name="email">
        <UInput v-model="state.email" />
      </UFormGroup>

      <UFormGroup label="Password" name="password">
        <UInput v-model="state.password" type="password" />
      </UFormGroup>

      <UButton type="submit" :loading="loading"> Submit </UButton>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'
import { toast } from 'vue-sonner'

const { t } = useI18n()
const auth = useAuth()

const schema = object({
  email: string().email('Invalid email').required('Required'),
  password: string().min(5, 'Must be at least 5 characters').required('Required')
})

type Schema = InferType<typeof schema>

const loading = ref(false)
const state = reactive<Schema>({
  email: '',
  password: ''
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true

  try {
    await auth.login(event.data.email, event.data.password)
    state.email = ''
    state.password = ''
    clearNuxtData()
    await clearError()
    await refreshNuxtData()
    await navigateTo('/')
    toast.info(t('success.login'))
  } catch (e) {
    toast.error(t(typeof e === 'string' ? e : 'errors.common'))
  } finally {
    loading.value = false
  }
}
</script>
