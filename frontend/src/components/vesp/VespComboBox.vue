<script setup lang="ts">
import { Pagination, PaginationList, PaginationListItem } from '@/components/ui/pagination'
import { computed, ref, watch, onMounted, type Ref } from 'vue'
import { cn } from '@/lib/utils'
import { useGet } from '@/utils/use-api'

const emit = defineEmits(['update:modelValue', 'load', 'failure', 'change', 'select', 'reset', 'keydown'])

const props = defineProps({
  modelValue: {
    type: Number,
    default: undefined
  },
  url: {
    type: String,
    required: true
  },
  valueField: {
    type: String,
    default: 'id'
  },
  textField: {
    type: String,
    default: 'title'
  },
  limit: {
    type: Number,
    default: 8
  },
  sort: {
    type: String,
    default: null
  },
  dir: {
    type: String,
    default: 'asc'
  },
  // filterProps: {
  //   type: Object,
  //   default() {
  //     return {}
  //   }
  // },
  onLoad: {
    type: Function,
    default(items: any) {
      return items
    }
  }
})

const triggerResizeObserver = ref()
const query = ref('')
const trigger = ref()
const width = ref(200)
const loading = ref(false)
const selected: Ref<Record<string, any> | undefined> = ref()
const options: Ref<Record<string, any>[]> = ref([])
const page = ref(1)
const total = ref(0)
const open = ref(false)

const value = computed({
  get() {
    return props.modelValue
  },
  set(newValue) {
    emit('update:modelValue', newValue)
  }
})

onMounted(() => {
  fetch()

  if (value.value && !selected.value) {
    initSelected()
  }
})

watch(page, fetch)

watch(query, fetch)

async function fetch() {
  const params = {
    // ...props.filterProps,
    query: query.value,
    limit: props.limit,
    sort: props.sort,
    dir: props.dir,
    page: page.value,
    combo: true
  }
  loading.value = true
  try {
    const items = props.onLoad(await useGet(props.url, params))
    options.value = items.rows || []
    total.value = items.total || 0
    emit('load', options.value, total.value)
  } catch (e) {
    emit('failure', e)
  } finally {
    loading.value = false
  }
}

async function initSelected() {
  loading.value = true
  try {
    selected.value = await useGet(`${props.url}/${value.value}`)
  } finally {
    loading.value = false
  }
}

function onSelect(e: any) {
  if (e.detail.value === value.value) {
    value.value = undefined
    selected.value = undefined
  } else {
    value.value = Number(e.detail.value)
    selected.value = options.value.find((option) => option[props.valueField] === Number(e.detail.value))
  }
  open.value = false
}

function onTriggerResize() {
  width.value = trigger.value.offsetWidth
}

function onTriggerMounted() {
  if (!triggerResizeObserver.value) {
    triggerResizeObserver.value = new ResizeObserver(onTriggerResize)
  }
  triggerResizeObserver.value.observe(trigger.value)
}

function onTriggerBeforeDestroy() {
  triggerResizeObserver.value.unobserve(trigger.value)
}
</script>

<template>
  <ui-popover v-model:open="open">
    <ui-popover-trigger as-child>
      <div ref="trigger" @vue:mounted="onTriggerMounted" @vue:beforeDestroy="onTriggerBeforeDestroy">
        <ui-button variant="outline" role="combobox" :aria-expanded="open" class="w-full justify-between" type="button">
          {{ selected ? selected[textField] : 'Выбрать...' }}
          <Icon name="radix-icons:caret-sort" class="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </ui-button>
      </div>
    </ui-popover-trigger>
    <ui-popover-content ref="content" class="p-0" :style="{ width: `${width}px` }">
      <ui-command v-model:searchTerm="query">
        <ui-command-input class="h-9" placeholder="Поиск..." />
        <ui-command-empty>No option found.</ui-command-empty>
        <ui-command-list>
          <!-- <template v-if="!!selected && !options.find((option) => option[valueField] === selected?.[valueField])">
            <ui-command-group>
              <ui-command-item :value="selected[valueField]" @select="onSelect">
                {{ selected[textField] }}
                <Icon name="radix-icons:check" class="ml-auto h-4 w-4 opacity-100" />
              </ui-command-item>
            </ui-command-group>
            <ui-command-separator />
          </template> -->
          <ui-command-group>
            <ui-command-item
              v-for="option in options"
              :key="option[valueField]"
              :value="option[valueField]"
              @select="onSelect"
            >
              {{ option[textField] }}
              <Icon
                name="radix-icons:check"
                :class="cn('ml-auto h-4 w-4', value === option[valueField] ? 'opacity-100' : 'opacity-0')"
              />
            </ui-command-item>
          </ui-command-group>
        </ui-command-list>
      </ui-command>

      <div v-if="total > limit" class="p-1 flex justify-end border-t">
        <Pagination v-model:page="page" :items-per-page="limit" :total="total" show-edges>
          <PaginationList class="flex items-center gap-1">
            <ui-pagination-first class="w-8 h-8" />
            <ui-pagination-prev class="w-8 h-8" />
            <ui-pagination-next class="w-8 h-8" />
            <ui-pagination-last class="w-8 h-8" />
          </PaginationList>
        </Pagination>
      </div>
    </ui-popover-content>
  </ui-popover>
</template>
