<template>
  <div class="flex flex-col gap-4">
    <FormField v-slot="{ componentField }" name="title">
      <ui-form-item>
        <ui-form-label>Название</ui-form-label>
        <ui-form-control>
          <ui-input type="text" placeholder="" v-bind="componentField" />
        </ui-form-control>
        <ui-form-message />
      </ui-form-item>
    </FormField>
    <FormField v-slot="{ componentField }" name="scope">
      <ui-form-item>
        <ui-form-label>Разрешения</ui-form-label>
        <ui-form-control>
          <ui-tags-input v-model="componentField.modelValue">
            <ui-tags-input-item v-for="item in componentField.modelValue" :key="item" :value="item">
              <ui-tags-input-item-text />
              <ui-tags-input-item-delete />
            </ui-tags-input-item>

            <ui-tags-input-input placeholder="Добавить..." />
          </ui-tags-input>
        </ui-form-control>
        <ui-form-message />
      </ui-form-item>
    </FormField>
  </div>
</template>

<script setup lang="ts">
import { FormField } from '@/components/ui/form'
</script>
