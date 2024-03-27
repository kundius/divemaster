<template>
  <div>
    <admin-page-header :title="$t('models.product.title_one')"></admin-page-header>

    <div class="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
      <aside class="-mx-4 lg:w-1/5">
        <nav class="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
          <nuxt-link v-for="item in sidebarNavItems" :key="item.name" :to="`/admin/products/${record.id}/${item.name}`">
            <ui-button
              :class="
                cn(
                  'w-full text-left justify-start',
                  $route.path === `/admin/products/${record.id}/${item.name}` && 'bg-muted hover:bg-muted'
                )
              "
              variant="ghost"
            >
              {{ item.title }}
            </ui-button>
          </nuxt-link>
        </nav>
      </aside>
      <div class="flex-1">
        <nuxt-page :record="record" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'
import type { VespProduct } from '@/types'

const record = ref<VespProduct>({
  id: 0,
  title: '',
  sku: ''
})

const id = useRoute().params.id
const url = `admin/products`
try {
  record.value = await useGet(`${url}/${id}`)
} catch (e: any) {
  showError({ statusCode: e.statusCode, statusMessage: e.message })
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
