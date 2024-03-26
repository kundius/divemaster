<template>
  <form @submit="submit">
    <slot name="form-fields" />
  </form>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import type { AnyObjectSchema } from 'yup'
import { toast } from 'vue-sonner'

const props = defineProps({
  url: {
    type: String,
    required: true
  },
  schema: {
    type: Object as PropType<AnyObjectSchema>,
    default() {
      return {}
    }
  },
  updateKey: {
    type: String,
    default: ''
  },
  method: {
    type: String,
    default: 'POST'
  },
  initialValues: {
    type: Object as PropType<Record<string, any>>,
    default() {
      return {}
    }
  }
})

const { t } = useI18n()

const emit = defineEmits(['success'])

const formSchema = toTypedSchema(props.schema)

const { handleSubmit } = useForm({
  validationSchema: formSchema,
  initialValues: props.initialValues
})

const updateKey = props.updateKey || props.url?.split('/').join('-')

const submit = handleSubmit(async (values) => {
  try {
    const data = await useApi(props.url, {
      method: props.method.toUpperCase(),
      body: values
    })
    toast.success(t('success.default'))
    emit('success', data)
    await refreshNuxtData(updateKey)
  } catch (e) {
    toast.error(t(typeof e === 'string' ? e : 'errors.default'))
  }
})

defineExpose({ submit })
</script>
