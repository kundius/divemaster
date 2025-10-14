'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { getClientUrl } from '@/lib/utils'
import { useAuthStore } from '@/providers/auth-store-provider'
import {
  BugIcon,
  CogIcon,
  NewspaperIcon,
  ScreenShareIcon,
  ShoppingCartIcon,
  TagIcon,
  UserIcon
} from 'lucide-react'
import { NavContent } from './NavContent'
import { NavMain } from './NavMain'
import { NavSecondary } from './NavSecondary'
import { NavUser } from './NavUser'
import Link from 'next/link'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ShadowInnerIcon } from '@radix-ui/react-icons'

const data = {
  navMain: [
    {
      title: 'Товары',
      url: '#',
      icon: TagIcon,
      isActive: true,
      items: [
        {
          title: 'Все товары',
          url: '/dashboard/products'
        },
        {
          title: 'Категории',
          url: '/dashboard/categories'
        },
        {
          title: 'Бренды',
          url: '/dashboard/brands'
        },
        {
          title: 'Характеристики',
          url: '/dashboard/properties'
        },
        {
          title: 'Синхронизация',
          url: '/dashboard/sync'
        },
        {
          title: 'Отзывы',
          url: '/dashboard/reviews'
        }
      ]
    },
    {
      title: 'Заказы',
      url: '#',
      icon: ShoppingCartIcon,
      items: [
        {
          title: 'Все заказы',
          url: '/dashboard/orders'
        }
      ]
    },
    {
      title: 'Клиенты',
      url: '#',
      icon: UserIcon,
      items: [
        {
          title: 'Все пользователи',
          url: '/dashboard/users'
        },
        {
          title: 'Доступы',
          url: '/dashboard/user-roles'
        }
      ]
    }
  ],
  navSecondary: [
    {
      title: 'Настройки',
      url: '#',
      icon: CogIcon
    },
    {
      title: 'Перейти на сайт',
      url: getClientUrl(),
      icon: ScreenShareIcon
    }
  ],
  navContent: [
    {
      name: 'Блог',
      url: '/dashboard/blog',
      icon: NewspaperIcon
    }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, logout } = useAuthStore((state) => state)
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link href="/dashboard">
                <Image src="/small-logo-transparent.png" width={24} height={24} alt="" />
                <span className="text-base font-semibold">DiveMaster</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavContent items={data.navContent} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {user && (
          <NavUser
            user={{
              avatar: '/small-logo-filled.png',
              email: user.email,
              name: user.name
            }}
            onLogout={logout}
          />
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
