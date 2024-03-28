<template>
  <div>
    <admin-page-header title="Группы">
      <template #actions>
        <nuxt-link :to="`/${url}/create`">
          <ui-button>Добавить группу</ui-button>
        </nuxt-link>
      </template>
    </admin-page-header>
    <vesp-table ref="table" v-bind="{ url, columns, filters, filter }">
      <template #scope-data="{ item }">
        <div class="flex flex-wrap gap-1">
          <ui-badge v-for="scope in item.scope" :key="scope" variant="secondary">
            {{ scope }}
          </ui-badge>
        </div>
      </template>
      <template #actions-data="{ item }">
        <div class="flex gap-2">
          <nuxt-link :to="`/${url}/${item.id}/edit`">
            <ui-button variant="outline" size="icon">
              <Icon name="heroicons:pencil-square" class="w-4 h-4" />
            </ui-button>
          </nuxt-link>
          <vesp-delete-dialog :url="`${url}/${item.id}`" @success="table.refresh()">
            <ui-button variant="destructive-outline" size="icon">
              <Icon name="heroicons:trash" class="w-4 h-4" />
            </ui-button>
          </vesp-delete-dialog>
        </div>
      </template>
    </vesp-table>
  </div>
</template>

<script setup lang="ts">
import type { VespTableColumn, VespTableFilter } from '@/types'

const { t } = useI18n()
const table = ref()
const url = 'admin/user-roles'
const filter = ref({ query: '' })
const filters = computed<VespTableFilter[]>(() => [
  { key: 'query', placeholder: t('models.user_role.title'), type: 'query' }
])
const columns = computed<VespTableColumn[]>(() => [
  { key: 'id', label: t('models.user_role.id'), sortable: true },
  { key: 'title', label: t('models.user_role.title'), sortable: true },
  { key: 'scope', label: t('models.user_role.scope') },
  { key: 'users_count', label: t('models.user_role.users'), sortable: true },
  { key: 'actions', label: '', headClass: 'w-0' }
])
</script>
