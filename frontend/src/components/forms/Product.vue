<template>
  <div>
    <div class="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
      <aside class="-mx-4 lg:w-1/5">
        <nav class="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
          <ui-button
            v-for="item in sidebarNavItems"
            :key="item.title"
            as="a"
            :href="item.href"
            variant="ghost"
            :class="cn(
              'w-full text-left justify-start',
              $route.path === `${item.href}.html` && 'bg-muted hover:bg-muted',
            )"
          >
            {{ item.title }}
          </ui-button>
        </nav>
      </aside>
      <div class="flex-1">
        <div class="space-y-6">
          <!-- <div>
            <h3 class="text-lg font-medium">
              Параметры
            </h3>
            <p class="text-sm text-muted-foreground">
              Основные параметры товара
            </p>
          </div>
          <ui-separator /> -->
          <div class="flex flex-col gap-4">
            <FormField v-slot="{ componentField }" name="title">
              <ui-form-item>
                <ui-form-label>{{ $t('models.product.title') }}</ui-form-label>
                <ui-form-control>
                  <ui-input type="text" placeholder="" v-bind="componentField" />
                </ui-form-control>
                <ui-form-message />
              </ui-form-item>
            </FormField>
            <FormField v-slot="{ componentField }" name="description">
              <ui-form-item>
                <ui-form-label>{{ $t('models.product.description') }}</ui-form-label>
                <ui-form-control>
                  <ui-textarea placeholder="" v-bind="componentField" />
                </ui-form-control>
                <ui-form-message />
              </ui-form-item>
            </FormField>
            <FormField v-slot="{ componentField }" name="sku">
              <ui-form-item>
                <ui-form-label>{{ $t('models.product.sku') }}</ui-form-label>
                <ui-form-control>
                  <ui-input type="text" placeholder="" v-bind="componentField" />
                </ui-form-control>
                <ui-form-message />
              </ui-form-item>
            </FormField>
            <FormField v-slot="{ componentField }" name="price">
              <ui-form-item>
                <ui-form-label>{{ $t('models.product.price') }}</ui-form-label>
                <ui-form-control>
                  <ui-input type="number" placeholder="" v-bind="componentField" />
                </ui-form-control>
                <ui-form-message />
              </ui-form-item>
            </FormField>
            <FormField v-slot="{ value, handleChange }" type="checkbox" :value="true" :unchecked-value="false" name="active">
              <ui-form-item>
                <ui-form-label>{{ $t('models.product.active') }}</ui-form-label>
                <ui-form-control>
                  <div>
                    <ui-checkbox :checked="value" @update:checked="handleChange" />
                  </div>
                </ui-form-control>
                <ui-form-message />
              </ui-form-item>
            </FormField>
            <FormField v-slot="{ componentField }" name="category_id">
              <ui-form-item>
                <ui-form-label>{{ $t('models.product.category_id') }}</ui-form-label>
                <ui-form-control>
                  <vesp-combo-box v-bind="componentField" url="admin/categories" />
                </ui-form-control>
                <ui-form-message />
              </ui-form-item>
            </FormField>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FormField } from '@/components/ui/form'
import { cn } from '@/lib/utils'

const $route = useRoute()

interface Item {
  title: string
  href: string
}

const sidebarNavItems: Item[] = [
  {
    title: 'Параметры',
    href: '/examples/forms/forms',
  },
  {
    title: 'Характеристики',
    href: '/examples/forms/display',
  },
  {
    title: 'Галерея',
    href: '/examples/forms/account',
  },
  {
    title: 'Связи',
    href: '/examples/forms/appearance',
  },
  {
    title: 'Отзывы',
    href: '/examples/forms/notifications',
  },
  {
    title: 'SEO',
    href: '/examples/forms/notifications',
  },
]
</script>
