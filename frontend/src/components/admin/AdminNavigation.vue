<template>
  <div class="navigation">
    <div v-for="(group, iGroup) in items" :key="iGroup" class="group">
      <div v-if="group.title" class="groupTitle">
        {{ group.title }}
      </div>
      <ul v-if="group.menu" class="firstMenu">
        <li v-for="(item1, i1) in group.menu" :key="i1" class="firstItem">
          <NuxtLink
            :to="item1.route"
            class="firstLink"
            :class="{ firstLinkActive: route.path.startsWith(item1.route) }"
          >
            <UIcon v-if="item1.icon" :name="item1.icon" class="firstIcon" />
            {{ item1.title }}
          </NuxtLink>
          <ul v-if="item1.menu" class="secondMenu" :class="{ secondMenuOpened: route.path.startsWith(item1.route) }">
            <li v-for="(item2, i2) in item1.menu" :key="i2" class="secondItem">
              <NuxtLink
                :to="item2.route"
                class="secondLink"
                :class="{ secondLinkActive: route.path.startsWith(item2.route) }"
              >
                {{ item2.title }}
              </NuxtLink>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
interface NavSecondLevelMenuItem {
  title: string
  route: string
}

interface NavFirstLevelMenuItem {
  route: string
  title: string
  icon?: string
  menu?: NavSecondLevelMenuItem[]
}

interface NavGroup {
  title?: string
  menu?: NavFirstLevelMenuItem[]
}

type Nav = NavGroup[]

const route = useRoute()

const items = ref<Nav>([
  {
    menu: [
      {
        title: 'Товары',
        route: '/admin/products',
        icon: 'i-heroicons-tag',
        menu: [
          {
            title: 'Все товары',
            route: '/admin/products'
          },
          {
            title: 'Категории',
            route: '/admin/categories'
          },
          {
            title: 'Бренды',
            route: '/admin/brands'
          },
          {
            title: 'Отзывы',
            route: '/admin/reviews'
          },
          {
            title: 'Параметры',
            route: '/admin/params'
          }
        ]
      },
      {
        title: 'Заказы',
        route: '/admin/orders',
        icon: 'i-heroicons-shopping-bag'
      },
      {
        title: 'Клиенты',
        route: '/admin/users',
        icon: 'i-heroicons-user',
        menu: [
          {
            title: 'Все пользователи',
            route: '/admin/users'
          },
          {
            title: 'Доступы',
            route: '/admin/user-roles'
          }
        ]
      }
    ]
  },
  {
    title: 'Контент',
    menu: [
      {
        title: 'Статьи',
        route: '/admin/articles',
        icon: 'i-heroicons-pencil-square',
        menu: [
          {
            title: 'Все статьи',
            route: '/admin/articles'
          },
          {
            title: 'Рубрики',
            route: '/admin/rubrics'
          }
        ]
      },
      {
        title: 'Страницы',
        route: '/admin/pages',
        icon: 'i-heroicons-document-text'
      }
    ]
  }
])
</script>

<style lang="scss" scoped>
.navigation {
}

.light {
}

.dark {
}

.group + .group {
  margin-top: 40px;
}

.groupTitle {
  color: var(--neutral200);
  font-size: 18px;
  margin-bottom: 16px;
  font-weight: 500;
  font-family: var(--font-sans-alt);
  line-height: 1;
  text-transform: uppercase;
  display: flex;
  align-items: center;

  &::before {
    content: '';
    display: block;
    height: 1px;
    background: currentColor;
    width: 10px;
    flex-shrink: 0;
    opacity: 0.25;
    margin-right: 6px;
  }

  &::after {
    content: '';
    display: block;
    height: 1px;
    background: currentColor;
    flex-grow: 1;
    opacity: 0.25;
    margin-left: 6px;
  }

  .dark & {
    color: var(--neutral700);
  }
}

.firstMenu {
  list-style: none;
  margin: 0;
  padding: 0;
}

.firstItem + .firstItem {
  margin-top: 12px;
}

.firstLink {
  text-decoration: none;
  font-size: 18px;
  color: var(--neutral200);
  font-weight: 500;
  font-family: var(--font-sans-alt);
  line-height: 20px;
  padding: 8px 16px;
  min-height: 40px;
  border-radius: 20px;
  display: flex;
  gap: 8px;
  align-items: center;

  .dark & {
    color: var(--neutral700);
  }
}

.firstItem:has(.secondLinkActive) .firstLink,
.firstLink:has(.firstLinkActive) .firstLink {
  background: linear-gradient(53deg, rgb(73, 87, 254) 0%, rgb(123, 66, 255) 100%);
  box-shadow: 0px 0px 6.86px 0.14px rgba(0, 29, 47, 0.3);
  color: var(--white);

  .dark & {
    color: var(--white);
  }
}

.firstLink:hover {
  background: var(--neutral200);
  color: var(--neutral700);
}

.firstIcon {
  width: 24px;
  height: 24px;
  align-self: flex-start;
  flex-shrink: 0;
}

.secondMenu {
  padding: 16px 0 20px 48px;
  margin: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 16px;
  display: none;
}

.firstItem:has(.secondLinkActive) .secondMenu,
.firstLink:has(.firstLinkActive) .secondMenu {
  display: flex;
}

.secondItem {
  position: relative;
}

.secondLink {
  color: var(--neutral200);
  font-size: 16px;
  font-weight: 400;
  font-family: var(--font-sans-alt);
  line-height: 1;
  display: flex;
  align-items: center;
  position: relative;

  .dark & {
    color: var(--neutral700);
  }
}

.secondLink:hover {
  color: var(--white);

  .dark & {
    color: var(--neutral700);
  }
}

.secondLinkActive {
  color: var(--white);

  .dark & {
    color: var(--neutral700);
  }
}

.secondLinkActive::before {
  content: '';
  position: absolute;
  left: -20px;
  top: 5px;
  border-radius: 2px;
  width: 5px;
  height: 5px;
  background: currentColor;
}
</style>
