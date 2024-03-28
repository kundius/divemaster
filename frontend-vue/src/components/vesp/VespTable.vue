<script setup lang="ts">
// если вызвать refresh после удаления последнего элемента на странице, то тоблица будет пустой
// items не типизированы 

import { Pagination, PaginationList, PaginationListItem } from '@/components/ui/pagination'
import type { VespTableColumn, VespTableFilter, VespTableOnLoad } from '@/types'
import { useCustomFetch } from '@/utils/use-api'
import { computed, ref, watch, type PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import { get } from 'lodash'

const emit = defineEmits(['update:modelValue', 'update:sort', 'update:dir', 'update:limit', 'update:filters'])
const props = defineProps({
  title: {
    type: String,
    default: null
  },
  modelValue: {
    type: Number,
    default: null
  },
  url: {
    type: String,
    required: true
  },
  columns: {
    type: Array as PropType<VespTableColumn[]>,
    default() {
      return []
    }
  },
  filters: {
    type: Object as PropType<VespTableFilter[]>,
    default() {
      return []
    }
  },
  filter: {
    type: Object as PropType<Record<string, any>>,
    default() {
      return {}
    }
  },
  sort: {
    type: String,
    default: ''
  },
  dir: {
    type: String,
    default: ''
  },
  limit: {
    type: Number,
    default: 10
  },
  onLoad: {
    type: Function as PropType<VespTableOnLoad>,
    default(data: any) {
      return data
    }
  }
})

const { t } = useI18n()
const internalValue = ref(1)
const tSort = ref(props.sort)
const tDir = ref(props.dir)
const tLimit = ref(props.limit)
const tFilter = ref(props.filter)
const tPage = computed({
  get() {
    return props.modelValue === null ? internalValue.value : props.modelValue
  },
  set(newValue) {
    internalValue.value = newValue
    emit('update:modelValue', newValue)
  }
})

const updateKey = props.url.split('/').join('-')

const params = computed(() => {
  return {
    limit: tLimit.value,
    page: tPage.value,
    ...getParams(true)
  }
})
const {
  data,
  refresh,
  pending: loading
} = useCustomFetch(props.url, {
  key: updateKey,
  query: params,
  onResponse({ response }) {
    response._data = props.onLoad(response._data)
  }
})
const total = computed(() => data.value?.total || 0)
const items = computed(() => data.value?.rows || [])

function getParams(asObject = false) {
  const params: Record<string, any> = {}
  Object.keys(tFilter.value).forEach((i) => {
    if (tFilter.value[i] !== '' && tFilter.value[i] !== null) {
      params[i] =
        typeof tFilter.value[i] === 'object' && !asObject ? JSON.stringify(tFilter.value[i]) : tFilter.value[i]
    }
  })
  if (tSort.value) {
    params.sort = tSort.value
    params.dir = tDir.value
  }

  return asObject ? JSON.parse(JSON.stringify(params)) : new URLSearchParams(params).toString()
}

function onSort(key: string) {
  tDir.value = !tDir.value || tSort.value !== key ? 'asc' : tDir.value === 'asc' ? 'desc' : ''
  tSort.value = key
}

defineExpose({
  getParams,
  page: tPage,
  sort: tSort,
  dir: tDir,
  loading,
  refresh,
  items
})

watch(tPage, () => {
  refresh()
})
watch(
  tFilter,
  () => {
    if (tPage.value !== 1) {
      tPage.value = 1
    }
    refresh()
  },
  { deep: true }
)
</script>

<template>
  <div>
    <div v-if="filters.length > 0" class="mb-4 flex flex-wrap items-center gap-4">
      <div v-for="item of filters" :key="item.key">
        <div v-if="item.type === 'facet'">
          facet
        </div>
        <div v-if="item.type === 'query'">
          <ui-input v-model="tFilter.query" :placeholder="item.placeholder" class="w-64" />
        </div>
      </div>
    </div>

    <div class="flex border border-gray-200 dark:border-gray-700 relative rounded-md overflow-hidden">
      <div class="relative overflow-x-auto flex-1">
        <ui-table>
          <ui-table-header>
            <ui-table-row>
              <ui-table-head v-for="column of columns" :key="column.key" :class="column.headClass">
                <ui-button v-if="column.sortable" variant="ghost" class="-mx-4" @click="onSort(column.key)">
                  {{ column.label }}
                  <Icon v-if="!tDir || tSort !== column.key" name="heroicons:arrows-up-down" class="w-4 h-4 ml-2" />
                  <Icon
                    v-if="tSort === column.key && tDir === 'asc'"
                    name="heroicons:bars-arrow-up"
                    class="w-4 h-4 ml-2"
                  />
                  <Icon
                    v-if="tSort === column.key && tDir === 'desc'"
                    name="heroicons:bars-arrow-down"
                    class="w-4 h-4 ml-2"
                  />
                </ui-button>
                <span v-else>
                  {{ column.label }}
                </span>
              </ui-table-head>
            </ui-table-row>
          </ui-table-header>
          <ui-table-body>
            <ui-table-row v-for="item of items" :key="item.id">
              <ui-table-cell v-for="column of columns" :key="column.key" :class="column.cellClass">
                <slot :name="`${column.key}-data`" v-bind="{ item }">
                  {{ get(item, column.key) }}
                </slot>
              </ui-table-cell>
            </ui-table-row>
          </ui-table-body>
        </ui-table>
      </div>
    </div>

    <div v-if="total > limit" class="mt-4 flex justify-between">
      <div></div>
      <div>
        <Pagination
          v-slot="{ page }"
          v-model:page="tPage"
          :items-per-page="tLimit"
          :total="total"
          :sibling-count="1"
          show-edges
        >
          <PaginationList v-slot="{ items: pages }" class="flex items-center gap-1">
            <ui-pagination-first />
            <ui-pagination-prev />

            <template v-for="(item, index) in pages">
              <PaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
                <ui-button class="w-9 h-9 p-0" :variant="item.value === page ? 'default' : 'outline'">
                  {{ item.value }}
                </ui-button>
              </PaginationListItem>
              <ui-pagination-ellipsis v-else :key="item.type" :index="index" />
            </template>

            <ui-pagination-next />
            <ui-pagination-last />
          </PaginationList>
        </Pagination>
      </div>
    </div>
  </div>
</template>
