<template>
  <div class="flex flex-col gap-4">
    <FormField v-slot="{ componentField }" name="title">
      <ui-form-item>
        <ui-form-label>{{ $t('models.category.title') }}</ui-form-label>
        <ui-form-control>
          <ui-input type="title" placeholder="" v-bind="componentField" />
        </ui-form-control>
        <ui-form-message />
      </ui-form-item>
    </FormField>
    <FormField v-slot="{ componentField }" name="description">
      <ui-form-item>
        <ui-form-label>{{ $t('models.category.description') }}</ui-form-label>
        <ui-form-control>
          <ui-textarea placeholder="" v-bind="componentField" />
        </ui-form-control>
        <ui-form-message />
      </ui-form-item>
    </FormField>
    <FormField v-slot="{ value, handleChange }" type="checkbox" :value="true" :unchecked-value="false" name="active">
      <ui-form-item>
        <ui-form-label>{{ $t('models.category.active') }}</ui-form-label>
        <ui-form-control>
          <div>
            <ui-switch :checked="value" @update:checked="handleChange" />
          </div>
        </ui-form-control>
        <ui-form-message />
      </ui-form-item>
    </FormField>
  </div>
</template>

<script setup lang="ts">
import { FormField } from '@/components/ui/form'
</script>
