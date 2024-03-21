<template>
  <div class="flex items-center justify-between px-3 sticky h-16 gap-4 bg-neutral-50/95 z-50 top-0 lg:px-8 lg:relative">
    <div class="md:w-36 lg:hidden">
      <AdminNavDrawer />
    </div>
    <AdminSearch />
    <div class="flex items-center gap-2 md:gap-4 md:w-32">
      <UPopover>
        <UButton icon="i-heroicons-bell" color="gray" variant="soft" :trailing="false" />

        <template #panel>
          <div class="p-4">
            <div class="h-20 w-48" />
          </div>
        </template>
      </UPopover>
      <UButton icon="i-heroicons-cog-6-tooth" color="gray" variant="soft" :trailing="false" />
      <UDropdown :items="userMenu" :popper="{ placement: 'bottom-end' }">
        <UAvatar alt="Benjamin Canac" size="sm" />
      </UDropdown>
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

const userMenu = [
  [
    {
      label: 'Редактировать',
      icon: 'i-heroicons-pencil-square-20-solid'
    }
  ],
  [
    {
      label: 'Выход',
      icon: 'i-heroicons-arrow-right-on-rectangle-20-solid',
      click: onLogout
    }
  ]
]
</script>
