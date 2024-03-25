<template>
  <div class="flex flex-col gap-4">
    <FormField v-slot="{ componentField }" name="title">
      <ui-form-item>
        <ui-form-label>Название</ui-form-label>
        <ui-form-control>
          <ui-input type="title" placeholder="" v-bind="componentField" />
        </ui-form-control>
        <ui-form-message />
      </ui-form-item>
    </FormField>
  </div>
</template>

<script setup lang="ts">
import { FormField } from '@/components/ui/form'
</script>
