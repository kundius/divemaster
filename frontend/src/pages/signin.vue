<template>
  <div class="flex justify-center items-center p-12">
    <div class="w-96">
      <form class="w-2/3 space-y-6" @submit="onSubmit">
        <Field v-slot="{ componentField }" name="email" :validate-on-blur="!isFieldDirty">
          <ui-form-item>
            <ui-form-label>E-mail</ui-form-label>
            <ui-form-control>
              <ui-input type="text" v-bind="componentField" />
            </ui-form-control>
            <ui-form-message />
          </ui-form-item>
        </Field>
        <Field v-slot="{ componentField }" name="password" :validate-on-blur="!isFieldDirty">
          <ui-form-item>
            <ui-form-label>Password</ui-form-label>
            <ui-form-control>
              <ui-input type="password" v-bind="componentField" />
            </ui-form-control>
            <ui-form-message />
          </ui-form-item>
        </Field>
        <ui-button type="submit">
          <Icon v-if="loading" name="heroicons:arrow-path" class="animate-spin w-4 h-4 mr-2" />
          Submit
        </ui-button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useForm, Field, Form } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { toast } from 'vue-sonner'

const { t } = useI18n()
const auth = useAuth()

const loading = ref(false)

const formSchema = toTypedSchema(
  z.object({
    email: z.string().min(1),
    password: z.string().min(1)
  })
)

const { isFieldDirty, handleSubmit, resetForm } = useForm({
  validationSchema: formSchema
})

const onSubmit = handleSubmit(async (values) => {
  loading.value = true

  try {
    await auth.login(values.email, values.password)
    resetForm()
    clearNuxtData()
    await clearError()
    await refreshNuxtData()
    await navigateTo('/')
    toast.info(t('success.login'))
  } catch (e) {
    toast.error(t(typeof e === 'string' ? e : 'errors.default'))
  } finally {
    loading.value = false
  }
})
</script>
