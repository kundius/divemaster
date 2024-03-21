<template>
  <div class="wrapper">
    <div class="container">
      <div class="layout">
        <div class="sidebar">
          <div class="sticky top-0">
            <div class="logo">
              <NuxtLink to="/admin">
                <img :src="logo" alt="Divemaster Logo" width="148" height="71" />
              </NuxtLink>
            </div>

            <AdminNavigation />
          </div>
        </div>
        <div class="body">
          <AdminHeader />

          <div className="p-3 lg:p-8 flex-grow">
            <nuxt-page />
          </div>

          <AdminFooter />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import logo from '@/assets/logo.png'
import logoDark from '@/assets/logo-dark.png'

const route = useRoute()
const { user } = useAuth()
const { t } = useI18n()
// const sections = computed(() => getAdminSections())

function checkAccess() {
  if (!user.value) {
    showError({ statusCode: 401, statusMessage: 'Unauthorized' })
    // navigateTo('/signin')
    // nextTick(() => {
    //   // showLogin(true)
    // })
  } else if (!hasScope('admin')) {
    showError({ statusCode: 403, statusMessage: 'Access Denied' })
  }
  //  else if (!sections.value.length) {
  //   showError({ statusCode: 403, statusMessage: 'Access Denied' })
  // } else if (route.name === 'admin') {
  //   navigateTo({ name: sections.value[0].route }, { replace: true })
  // } else {
  //   const section = sections.value.find((i) => i.route === route.name)
  //   if (section && section.scope && !hasScope(section.scope)) {
  //     showError({ statusCode: 403, statusMessage: 'Access Denied' })
  //   }
  // }
}

function setTitle() {
  const routeName = route.name as string
  if (route.matched.length === 2) {
    const name = routeName.replace(/^admin-/, '').replace('-', '_')
    useHead({
      title: () => [t('pages.admin.' + name), t('pages.admin.title'), t('project')].join(' / ')
    })
  }
}

checkAccess()
setTitle()

watch(
  () => route.name,
  () => {
    checkAccess()
    setTitle()
  }
)
</script>

<style lang="scss" scoped>
.wrapper {
  background: linear-gradient(to right, #262f3d 0%, #262f3d 50%, transparent 50%, transparent 100%),
    linear-gradient(to bottom, #fafafa 0, #fafafa 64px, transparent 64px, transparent 100%);
}

.container {
  width: 1400px;
  margin-left: auto;
  margin-right: auto;
  max-width: 100%;
}

.layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 280px;
  padding: 0 24px;
  z-index: 2;
  position: relative;
  flex-shrink: 0;
  background: #262f3d;

  @include --max-lg {
    display: none;
  }
}

.body {
  flex-grow: 1;
  background: #fff;
  z-index: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  max-width: 100%;
}

.content {
  padding: 24px;
}

.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 16px;
  padding-bottom: 12px;
  margin-bottom: 32px;
}
</style>
