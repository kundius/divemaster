<template>
  <div>
    <admin-page-header :title="$t('models.product.title_many')">
      <template #actions>
        <nuxt-link :to="`/${url}/create`">
          <ui-button>{{ $t('models.product.add') }}</ui-button>
        </nuxt-link>
      </template>
    </admin-page-header>
    <vesp-table ref="table" v-bind="{ url, columns, filters, filter }">
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
      <template #active-data="{ item }">
        <Icon v-if="item.active" name="heroicons:check-circle" class="w-6 h-6 text-green-500" />
        <Icon v-else name="heroicons:x-circle" class="w-6 h-6 text-amber-500" />
      </template>
    </vesp-table>
  </div>
</template>

<script setup lang="ts">
import type { VespTableColumn, VespTableFilter } from '@/types'

const { t } = useI18n()
const table = ref()
const url = 'admin/products'
const filter = ref({ query: '' })
const filters = computed<VespTableFilter[]>(() => [{ key: 'query', placeholder: 'Поиск', type: 'query' }])
const columns = computed<VespTableColumn[]>(() => [
  { key: 'id', label: t('models.product.id'), sortable: true },
  { key: 'title', label: t('models.product.title'), sortable: true },
  { key: 'category.title', label: t('models.product.category') },
  { key: 'price', label: t('models.product.price'), sortable: true },
  { key: 'active', label: t('models.product.active'), sortable: true },
  { key: 'actions', label: '', headClass: 'w-0' }
])
</script>
