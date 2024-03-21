<script setup lang="ts">
import { computed, type PropType, type Ref, ref, watch } from 'vue'
import type { RouteLocationNamedRaw } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { VespTableAction, VespTableColumn, VespTableOnLoad } from '@/types'
import { useCustomFetch, useDelete } from '@/utils/use-api'
import { toast } from 'vue-sonner'

const emit = defineEmits(['update:modelValue', 'update:sort', 'update:dir', 'update:limit', 'update:filters', 'delete'])
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
    type: Object as PropType<Record<string, any>>,
    default() {
      return {}
    }
  },
  updateKey: {
    type: String,
    default: ''
  },
  primaryKey: {
    type: [String, Array],
    default: 'id'
  },
  sort: {
    type: String,
    default: 'id'
  },
  dir: {
    type: String,
    default: 'asc'
  },
  limit: {
    type: Number,
    default: 20
  },
  headerActions: {
    type: Array as PropType<VespTableAction[]>,
    default() {
      return []
    }
  },
  tableActions: {
    type: Array as PropType<VespTableAction[]>,
    default() {
      return []
    }
  },
  pageLimit: {
    type: Number,
    default: 7
  },
  onLoad: {
    type: Function as PropType<VespTableOnLoad>,
    default(data: any) {
      return data
    }
  },
  emptyText: {
    type: String,
    default: 'components.table.no_data'
  },
  emptyFilteredText: {
    type: String,
    default: 'components.table.no_results'
  },
  deleteTitle: {
    type: String,
    default: 'components.table.delete.title'
  },
  deleteText: {
    type: String,
    default: 'components.table.delete.confirm'
  }
})

const { t } = useI18n()
const internalValue = ref(1)
const tSort = ref({
  column: props.sort,
  direction: props.dir
})
// const tSort = ref(props.sort)
// const tDir = ref(props.dir)
const tLimit = ref(props.limit)
const tFilters = ref(props.filters)
const tPage = computed({
  get() {
    return props.modelValue === null ? internalValue.value : props.modelValue
  },
  set(newValue) {
    internalValue.value = newValue
    emit('update:modelValue', newValue)
  }
})
const tColumns = computed(() => {
  const columns = [...props.columns]
  if (props.tableActions.length && columns.findIndex((item) => item.key === 'actions') === -1) {
    columns.push({ key: 'actions', label: '', class: 'actions' })
  }
  return columns
})
// const hasQuery = computed(() => {
//   return Object.keys(tFilters.value).includes('query')
// })
const updateKey = props.updateKey || props.url.split('/').join('-')

const deleteVisible = ref(false)
// const deleteLoading = ref(false)
const deleting: Ref<Record<any, any>> = ref({})
// const deleteProps = { item: deleting, visible: deleteVisible, loading: deleteLoading, deleteItem }

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

// function onSort(field: string, desc: boolean) {
//   tSort.value = field
//   tDir.value = desc ? 'desc' : 'asc'
//   refresh()
// }

// function mapRouteParams(action: VespTableAction, item: Record<string, any>): RouteLocationNamedRaw | undefined {
//   if (!action.route) {
//     return undefined
//   }
//   if (!action.map) {
//     action.map = {}
//     if (typeof props.primaryKey === 'string') {
//       action.map[props.primaryKey] = props.primaryKey
//     } else {
//       props.primaryKey.forEach((i: any) => {
//         // @ts-ignore
//         action.map[i] = i
//       })
//     }
//   }
//   const params: Record<string, any> = {}
//   for (const key of Object.keys(action.map)) {
//     const val = action.map[key]
//     if (/\./.test(val)) {
//       const keys = val.split('.')
//       let local = { ...item }
//       for (const i of keys) {
//         local = local[i]
//       }
//       params[key] = local
//     } else {
//       params[key] = item[val]
//     }
//   }
//   return { ...action.route, params }
// }

// function onClick(action: VespTableAction, item: Record<string, any>) {
//   if (action.function) {
//     action.function(JSON.parse(JSON.stringify(item)))
//   }
// }

function getParams(asObject = false) {
  const params: Record<string, any> = {}
  Object.keys(props.filters).forEach((i) => {
    if (props.filters[i] !== '' && props.filters[i] !== null) {
      params[i] =
        typeof props.filters[i] === 'object' && !asObject ? JSON.stringify(props.filters[i]) : props.filters[i]
    }
  })
  if (tSort.value) {
    params.sort = tSort.value.column
    params.dir = tSort.value.direction
  }

  return asObject ? JSON.parse(JSON.stringify(params)) : new URLSearchParams(params).toString()
}

function onDelete(item: any) {
  deleteVisible.value = true
  deleting.value = item
}

// async function deleteItem() {
//   deleteLoading.value = true
//   const item = deleting.value
//   try {
//     if (typeof props.primaryKey === 'string' && item[props.primaryKey]) {
//       await useDelete(props.url + '/' + item[props.primaryKey])
//     } else if (Array.isArray(props.primaryKey)) {
//       const params: Record<string, any> = {}
//       props.primaryKey.forEach((i: any) => {
//         params[i] = item[i]
//       })
//       await useDelete(props.url, params)
//     } else {
//       await useDelete(props.url, item)
//     }
//     deleteVisible.value = false
//     await refresh()
//   } catch (e) {
//     toast.error(t(typeof e === 'string' ? e : 'errors.common'))
//   } finally {
//     deleteLoading.value = false
//   }
// }

defineExpose({
  getParams,
  page: tPage,
  sort: tSort.value.column,
  dir: tSort.value.direction,
  loading,
  delete: onDelete,
  refresh,
  items
})

watch(tPage, () => {
  refresh()
})
watch(
  tFilters,
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
    <div class="flex items-center justify-between flex-wrap gap-4 mb-8">
      <div>
        <slot name="header-title">
          <h1 class="scroll-m-20 text-4xl font-medium tracking-tight">
            {{ title }}
          </h1>
        </slot>
      </div>

      <div></div>

      <div>
        <slot name="header-actions">
          <div class="flex items-center flex-wrap gap-3">
            <UButton
              v-for="(action, idx) in headerActions"
              :key="idx"
              :icon="action.icon"
              :size="action.size || 'md'"
              :variant="action.variant || 'solid'"
              :class="action.class"
              :to="action.route"
              @click="action.function"
            >
              {{ action.title }}
            </UButton>
          </div>
        </slot>
      </div>
    </div>

    <div class="flex border border-gray-200 dark:border-gray-700 relative rounded-md overflow-hidden">
      <div class="relative overflow-x-auto flex-1">
        <UTable v-model:sort="tSort" :rows="items" :columns="tColumns" sort-mode="manual">
          <template v-for="(_, slot) of $slots" #[slot]="scope">
            <slot :name="slot" v-bind="scope"></slot>
          </template>

          <template #actions-data="{ item }">
            <div class="flex gap-2">
              <UButton
                v-for="(action, idx) in tableActions"
                :key="idx"
                :icon="action.icon"
                :size="action.size || 'md'"
                :variant="action.variant || 'solid'"
                :class="action.class"
                :to="action.route"
                :label="!action.icon ? action.title : undefined"
                @click="action.function"
              />
            </div>
          </template>
        </UTable>
      </div>
    </div>

    <div v-if="total > limit" class="mt-8 flex justify-between">
      <div></div>
      <div>
        <UPagination v-model="tPage" :page-count="tLimit" :total="total" />
      </div>
    </div>

    <UModal v-model="deleteVisible">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header> Placeholder </template>

        Placeholder

        <template #footer> Placeholder </template>
      </UCard>
    </UModal>
  </div>
</template>
