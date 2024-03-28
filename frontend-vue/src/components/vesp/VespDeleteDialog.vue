<template>
  <ui-alert-dialog v-model:open="isOpen">
    <ui-alert-dialog-trigger as-child>
      <slot></slot>
    </ui-alert-dialog-trigger>
    <ui-alert-dialog-content>
      <ui-alert-dialog-header>
        <ui-alert-dialog-title>Требуется подтверждение</ui-alert-dialog-title>
        <ui-alert-dialog-description> Вы уверены, что хотите удалить эту запись? </ui-alert-dialog-description>
      </ui-alert-dialog-header>
      <ui-alert-dialog-footer>
        <ui-alert-dialog-cancel>Отмена</ui-alert-dialog-cancel>
        <ui-button variant="destructive" :disabled="loading" @click="handleAction">
          <Icon v-if="loading" name="heroicons:arrow-path" class="animate-spin w-4 h-4 mr-2" />
          Удалить
        </ui-button>
      </ui-alert-dialog-footer>
    </ui-alert-dialog-content>
  </ui-alert-dialog>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'

const props = defineProps({
  url: {
    type: String,
    required: true
  },
  updateKey: {
    type: String,
    default: ''
  },
})

const { t } = useI18n()

const emit = defineEmits(['success'])

const isOpen = ref(false)
const loading = ref(false)
const updateKey = props.updateKey || props.url?.split('/').join('-')

async function handleAction() {
  try {
    loading.value = true
    const data = await useApi(props.url, {
      method: 'DELETE'
    })
    toast.success(t('success.user_role.delete'))
    isOpen.value = false
    emit('success', data)
    await refreshNuxtData(updateKey)
  } catch (e) {
    toast.error(t(typeof e === 'string' ? e : 'errors.default'))
  } finally {
    loading.value = false
  }
}
</script>
