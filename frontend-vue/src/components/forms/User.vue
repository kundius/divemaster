<template>
  <div class="flex flex-col gap-4">
    <FormField v-slot="{ componentField }" name="email">
      <ui-form-item>
        <ui-form-label>E-mail</ui-form-label>
        <ui-form-control>
          <ui-input type="email" placeholder="" v-bind="componentField" />
        </ui-form-control>
        <ui-form-message />
      </ui-form-item>
    </FormField>
    <FormField v-slot="{ componentField }" name="username">
      <ui-form-item>
        <ui-form-label>Логин</ui-form-label>
        <ui-form-control>
          <ui-input type="text" placeholder="" v-bind="componentField" />
        </ui-form-control>
        <ui-form-message />
      </ui-form-item>
    </FormField>
    <FormField v-slot="{ componentField }" name="fullname">
      <ui-form-item>
        <ui-form-label>Имя</ui-form-label>
        <ui-form-control>
          <ui-input type="text" placeholder="" v-bind="componentField" />
        </ui-form-control>
        <ui-form-message />
      </ui-form-item>
    </FormField>
    <FormField v-slot="{ componentField }" name="password">
      <ui-form-item>
        <ui-form-label>Пароль</ui-form-label>
        <ui-form-control>
          <ui-input type="text" placeholder="" v-bind="componentField" />
        </ui-form-control>
        <ui-form-message />
      </ui-form-item>
    </FormField>
    <FormField v-slot="{ componentField }" name="role_id">
      <ui-form-item>
        <ui-form-label>Группа</ui-form-label>
        <ui-form-control>
          <vesp-combo-box v-bind="componentField" url="admin/user-roles" />
        </ui-form-control>
        <ui-form-message />
      </ui-form-item>
    </FormField>
  </div>
</template>

<script setup lang="ts">
import { FormField } from '@/components/ui/form'
</script>
