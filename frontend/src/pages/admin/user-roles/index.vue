<template>
  <VespTable ref="table" title="Доступы" v-bind="{ url, columns, filters, headerActions, tableActions }">
    <template #scope-data="{ row }">
      <div class="flex flex-wrap gap-1">
        <UBadge v-for="scope in row.scope" :key="scope" color="gray" variant="solid">
          {{ scope }}
        </UBadge>
      </div>
    </template>
    <template #actions-data="{ row }">
      <UButtonGroup size="sm" orientation="horizontal">
        <UButton
          icon="i-heroicons-pencil-square-20-solid"
          size="xs"
          color="gray"
          variant="solid"
          :to="`${url}/${row.id}`"
        />
        <UButton icon="i-heroicons-chevron-down-20-solid" color="red" variant="solid" />
      </UButtonGroup>
    </template>
  </VespTable>
</template>

<script setup lang="ts">
import type { VespTableAction } from '@/types'

const { t } = useI18n()
const table = ref()
const url = 'admin/user-roles'
const filters = ref({ query: '' })
const columns = computed(() => [
  { key: 'id', label: t('models.user_role.id'), sortable: true },
  { key: 'title', label: t('models.user_role.title'), sortable: true },
  { key: 'scope', label: t('models.user_role.scope') },
  { key: 'users_count', label: t('models.user_role.users'), sortable: true }
])
const headerActions: ComputedRef<VespTableAction[]> = computed(() => [
  { route: '/admin/user-roles/create', icon: 'i-heroicons-plus', title: t('actions.create') }
])
const tableActions: ComputedRef<VespTableAction[]> = computed(() => [
  { icon: 'edit', title: t('actions.edit') },
  { function: (i: any) => table.value.delete(i), icon: 'times', title: t('actions.delete'), variant: 'danger' }
])
</script>
