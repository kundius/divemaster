<template>
  <div>
    <admin-page-header :title="$t('models.product.title_one')"></admin-page-header>

    <div class="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
      <aside class="-mx-4 lg:w-1/5">
        <nav class="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
          <ui-button
            v-for="item in sidebarNavItems"
            :key="item.name"
            :class="cn('w-full text-left justify-start', item.name === 'edit' && 'bg-muted hover:bg-muted')"
            :disabled="item.name !== 'edit'"
            variant="ghost"
          >
            {{ item.title }}
          </ui-button>
        </nav>
      </aside>
      <div class="flex-1">
        <vesp-form ref="form" method="put" :url="url" :schema="schema" :initial-values="record" @success="onSuccess">
          <template #form-fields>
            <forms-product-edit />
          </template>
        </vesp-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { boolean, number, object, string } from 'yup'
import type { VespUser } from '@/types'
import { cn } from '@/lib/utils'

const url = `admin/products`
const form = ref()
const schema = markRaw(
  object({
    title: string().required(),
    description: string(),
    sku: string().required(),
    price: number().required(),
    category_id: number().required(),
    active: boolean().required()
  })
)
const record = ref({
  id: 0,
  title: '',
  active: true,
  description: '',
  sku: '',
  price: undefined,
  category_id: undefined
})

function onSuccess(data: VespUser) {
  navigateTo(`/${url}/${data.id}/edit`)
}

interface Item {
  title: string
  name: string
}

const sidebarNavItems: Item[] = [
  {
    title: 'Основное',
    name: 'edit'
  },
  {
    title: 'Характеристики',
    name: 'options'
  },
  {
    title: 'Галерея',
    name: 'gallery'
  },
  {
    title: 'Связи',
    name: 'related'
  },
  {
    title: 'Отзывы',
    name: 'reviews'
  },
  {
    title: 'SEO',
    name: 'seo'
  }
]
</script>
