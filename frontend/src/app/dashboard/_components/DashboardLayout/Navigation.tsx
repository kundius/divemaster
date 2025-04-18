'use client'

import { cn } from '@/lib/utils'
import {
  DocumentTextIcon,
  PencilSquareIcon,
  ShoppingBagIcon,
  TagIcon,
  UserIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import styles from './Navigation.module.scss'

interface NavSecondLevelMenuItem {
  title: string
  route: string
}

interface NavFirstLevelMenuItem {
  route: string
  title: string
  icon?: React.ForwardRefExoticComponent<React.PropsWithoutRef<React.SVGProps<SVGSVGElement>>>
  menu?: NavSecondLevelMenuItem[]
}

interface NavGroup {
  title?: string
  menu?: NavFirstLevelMenuItem[]
}

type Nav = NavGroup[]

const nav: Nav = [
  {
    menu: [
      {
        title: 'Товары',
        route: '/dashboard/products',
        icon: TagIcon,
        menu: [
          {
            title: 'Все товары',
            route: '/dashboard/products'
          },
          {
            title: 'Категории',
            route: '/dashboard/categories'
          },
          {
            title: 'Бренды',
            route: '/dashboard/brands'
          },
          // {
          //   title: 'Отзывы',
          //   route: '/dashboard/reviews'
          // },
          {
            title: 'Характеристики',
            route: '/dashboard/properties'
          },
          {
            title: 'Синхронизация',
            route: '/dashboard/sync'
          }
        ]
      },
      {
        title: 'Заказы',
        route: '/dashboard/orders',
        icon: ShoppingBagIcon,
        menu: [
          {
            title: 'Все заказы',
            route: '/dashboard/orders'
          }
          // {
          //   title: 'Пункты выдачи',
          //   route: '/dashboard/orders/pickup-points'
          // }
        ]
      },
      {
        title: 'Клиенты',
        route: '/dashboard/users',
        icon: UserIcon,
        menu: [
          {
            title: 'Все пользователи',
            route: '/dashboard/users'
          },
          {
            title: 'Доступы',
            route: '/dashboard/user-roles'
          }
        ]
      }
    ]
  },
  {
    title: 'Контент',
    menu: [
      {
        title: 'Блог',
        route: '/dashboard/blog',
        icon: PencilSquareIcon
      }
      // {
      //   title: 'Страницы',
      //   route: '/dashboard/pages',
      //   icon: DocumentTextIcon
      // }
    ]
  }
]

function SecondLevelMenuItem({ route, title }: NavSecondLevelMenuItem) {
  const pathname = usePathname()
  const checkIsActive = () => {
    if (pathname === route) {
      return true
    }
    return false
  }
  const isActive = checkIsActive()
  return (
    <li className={styles.secondItem}>
      <Link
        href={route}
        className={cn(styles.secondLink, {
          [styles.secondLinkActive]: isActive
        })}
      >
        {title}
      </Link>
    </li>
  )
}

function SecondLevelMenu({
  menu,
  opened = false
}: {
  menu: NavSecondLevelMenuItem[]
  opened?: boolean
}) {
  return (
    <ul
      className={cn(styles.secondMenu, {
        [styles.secondMenuOpened]: opened
      })}
    >
      {menu.map((item, i) => (
        <SecondLevelMenuItem {...item} key={i} />
      ))}
    </ul>
  )
}

function FirstLevelMenuItem({ route, title, icon: Icon, menu }: NavFirstLevelMenuItem) {
  const pathname = usePathname()
  const checkIsActive = () => {
    if (pathname.startsWith(route)) {
      return true
    }
    if (menu) {
      return !!menu.find((item) => pathname.startsWith(item.route))
    }
    return false
  }
  const isActive = checkIsActive()
  return (
    <li className={styles.firstItem}>
      <Link
        href={route}
        className={cn(styles.firstLink, {
          [styles.firstLinkActive]: isActive
        })}
      >
        {Icon && <Icon className={styles.firstIcon} />}
        {title}
      </Link>
      {menu && <SecondLevelMenu menu={menu} opened={isActive} />}
    </li>
  )
}

function FirstLevelMenu({ menu }: { menu: NavFirstLevelMenuItem[] }) {
  return (
    <ul className={styles.firstMenu}>
      {menu.map((item, i) => (
        <FirstLevelMenuItem {...item} key={i} />
      ))}
    </ul>
  )
}

function Group({ title, menu }: NavGroup) {
  return (
    <div className={styles.group}>
      {title && <div className={styles.groupTitle}>{title}</div>}
      {menu && <FirstLevelMenu menu={menu} />}
    </div>
  )
}

export function Navigation({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  return (
    <div className={cn(styles.navigation, styles[variant])}>
      {nav.map((item, i) => (
        <Group {...item} key={i} />
      ))}
    </div>
  )
}
