<template>
  <div>
    <FormField v-slot="{ componentField }" name="title">
      <ui-form-item>
        <ui-form-label>Название</ui-form-label>
        <ui-form-control>
          <ui-input type="text" placeholder="" v-bind="componentField" />
        </ui-form-control>
        <ui-form-message />
      </ui-form-item>
    </FormField>
    <!-- <ui-button type="submit"> Submit </ui-button> -->
  </div>
</template>

<script setup lang="ts">
import { FormField } from '@/components/ui/form'
</script>
