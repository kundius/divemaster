<template>
  <form @submit="onSubmit">
    <slot name="form-fields" />
  </form>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import type { AnyObjectSchema } from 'yup'

const props = defineProps({
  schema: {
    type: Object as PropType<AnyObjectSchema>,
    default() {
      return {}
    }
  },
  initialValues: {
    type: Object as PropType<Record<string, any>>,
    default() {
      return {}
    }
  }
})

const formSchema = toTypedSchema(props.schema)

const { handleSubmit } = useForm({
  validationSchema: formSchema,
  initialValues: props.initialValues
})

const onSubmit = handleSubmit((values) => {
  console.log('Form submitted!', values)
})

defineExpose({ onSubmit })
</script>
