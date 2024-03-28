<template>
  <div>
    <div class="space-between flex items-center mb-4">
      <div class="ml-auto">
        <ui-button @click="onFileSelect">
          <Icon name="heroicons:plus-circle" class="mr-2 -ml-2 h-6 w-6" />
          {{ $t('actions.upload') }}
        </ui-button>
      </div>
    </div>

    <ui-overlay :show="loading">
      <VueDraggable
        v-model="files"
        class="draggable grid grid-cols-4 gap-4"
        @update="onSort"
        @drop.prevent="onAddFiles"
        @dragover.prevent
      >
        <div v-for="image in files" :key="image.file_id" class="border rounded-lg p-2 hover:border-neutral-300 hover:bg-neutral-50 hover:shadow-sm card">
          <nuxt-img
            :src="getImageLink(image.file, { fit: 'crop', w: thumbWidth, h: thumbHeight })"
            :width="thumbWidth"
            :height="thumbHeight"
            :data-disabled="!image.active"
            class="w-full block data-[disabled=true]:grayscale data-[disabled=true]:opacity-50"
            alt=""
          />
          <div class="flex gap-2 justify-end mt-2">
            <ui-button v-if="image.active" variant="outline" size="icon" @click="onDisable(image)">
              <Icon name="heroicons:power" class="w-4 h-4 text-amber-600" />
            </ui-button>
            <ui-button v-else variant="outline" size="icon" @click="onEnable(image)">
              <Icon name="heroicons:check" class="w-4 h-4 text-green-600" />
            </ui-button>

            <ui-button variant="destructive-outline" size="icon" @click="onDelete(image)">
              <Icon name="heroicons:trash" class="w-4 h-4" />
            </ui-button>
          </div>
        </div>
      </VueDraggable>
    </ui-overlay>
  </div>
</template>

<script setup lang="ts">
import type { VespProductFile, VespData } from '~/types'
import { VueDraggable } from 'vue-draggable-plus'

const props = defineProps({
  productId: {
    type: Number,
    required: true
  },
  thumbWidth: {
    type: Number,
    default: 200
  },
  thumbHeight: {
    type: Number,
    default: 200
  }
})
const emit = defineEmits(['load', 'failure'])

onMounted(() => {
  fetch()
})

const loading = ref(false)
const total = ref(0)
const files = ref<VespProductFile[]>([])

const url = computed(() => `admin/product/${props.productId}/files`)

function onFileSelect() {
  const el = document.createElement('input')
  el.type = 'file'
  el.multiple = true
  el.accept = 'image/*'
  el.click()
  el.addEventListener('change', (e) => {
    onAddFiles({ dataTransfer: e.target } as DragEvent)
  })
}

async function onAddFiles(e: DragEvent) {
  const nativeFiles: File[] = Array.from(e.dataTransfer?.files || [])
  if (!nativeFiles.length) {
    return
  }
  const asyncLoad = (file: File): Promise<VespProductFile> => {
    const reader = new FileReader()
    return new Promise((resolve, reject) => {
      reader.onload = async ({ target }) => {
        if (target) {
          const data = await usePut<VespProductFile>(url.value, {
            file: target.result,
            metadata: { name: file.name, size: file.size, type: file.type }
          })
          resolve(data)
        } else {
          reject(new Error('target is null'))
        }
      }
      reader.readAsDataURL(file)
    })
  }
  loading.value = true
  try {
    for (const file of nativeFiles) {
      if (file.type.includes('image/')) {
        const res = await asyncLoad(file)
        files.value.push(res)
      }
    }
    // this.emitUpdate()
  } catch (e) {
    emit('failure', e)
  } finally {
    loading.value = false
  }
}

async function onSort() {
  const _files: { [key: number]: number } = {}
  files.value.forEach((i, idx) => {
    _files[i.file_id] = idx
  })
  await usePost(url.value, { files: _files })
}

async function onDisable(image: VespProductFile) {
  image.active = false
  await usePatch(url.value + '/' + image.file_id, { active: false })
}

async function onEnable(image: VespProductFile) {
  image.active = true
  await usePatch(url.value + '/' + image.file_id, { active: true })
}

async function onDelete(image: VespProductFile) {
  loading.value = true
  await useDelete(url.value + '/' + image.file_id)
  files.value = files.value.filter((i) => i.file_id !== image.file_id)
  loading.value = false
}

async function fetch() {
  loading.value = true
  try {
    const items = await useGet<VespData<VespProductFile>>(url.value)
    files.value = items.rows || []
    total.value = items.total || 0
    emit('load', files.value, total.value)
  } catch (e) {
    emit('failure', e)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.card.sortable-chosen {
  background: var(--blue50);
  border-color: var(--blue300);
}
</style>
