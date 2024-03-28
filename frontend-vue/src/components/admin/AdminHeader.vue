<template>
  <div class="flex items-center justify-between px-3 sticky h-16 gap-4 bg-neutral-50/95 z-50 top-0 lg:px-8 lg:relative">
    <div class="md:w-36 lg:hidden">
      <AdminNavDrawer />
    </div>

    <AdminSearch />

    <div class="flex items-center gap-2 md:gap-4 md:w-36">
      <ui-popover>
        <ui-popover-trigger>
          <ui-button variant="ghost" size="icon">
            <Icon name="heroicons:bell" class="w-6 h-6" />
          </ui-button>
        </ui-popover-trigger>
        <ui-popover-content />
      </ui-popover>

      <ui-button variant="ghost" size="icon">
        <Icon name="heroicons:cog-6-tooth" class="w-6 h-6" />
      </ui-button>

      <ui-dropdown-menu>
        <ui-dropdown-menu-trigger>
          <ui-avatar>
            <ui-avatar-image src="https://github.com/radix-vue.png" alt="@radix-vue" />
            <ui-avatar-fallback>CN</ui-avatar-fallback>
          </ui-avatar>
        </ui-dropdown-menu-trigger>
        <ui-dropdown-menu-content>
          <ui-dropdown-menu-label>Мой профиль</ui-dropdown-menu-label>
          <ui-dropdown-menu-separator />
          <ui-dropdown-menu-item>Редактировать</ui-dropdown-menu-item>
          <ui-dropdown-menu-item @click="onLogout">Выход</ui-dropdown-menu-item>
        </ui-dropdown-menu-content>
      </ui-dropdown-menu>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'

const { t } = useI18n()
const auth = useAuth()

const onLogout = async () => {
  try {
    await auth.logout()
    toast.info(t('success.logout'))
    clearNuxtData()

    const name = String(useRoute().name)
    if (name.startsWith('user') || name.startsWith('admin')) {
      navigateTo('/')
    } else {
      await refreshNuxtData()
    }
  } catch (e) {
    console.error(e)
  }
}
</script>
