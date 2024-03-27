<template>
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
    <FormField v-slot="{ componentField }" name="category_id">
      <ui-form-item>
        <ui-form-label>{{ $t('models.product.category_id') }}</ui-form-label>
        <ui-form-control>
          <vesp-combo-box v-bind="componentField" url="admin/categories" />
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
    <div>
      <ui-button type="submit">{{ $t('actions.save') }}</ui-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FormField } from '@/components/ui/form'
</script>
