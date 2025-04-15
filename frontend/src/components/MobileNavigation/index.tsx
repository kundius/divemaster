'use client'

import { cn, disableScroll, enableScroll } from '@/lib/utils'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Skeleton } from '../ui/skeleton'
import styles from './index.module.scss'

const MobileNavigationSkeleton = () => {
  return (
    <div className="space-y-5 p-5">
      <Skeleton className="w-full h-5" />
      <Skeleton className="w-2/3 h-5" />
      <Skeleton className="w-full h-5" />
      <Skeleton className="w-1/2 h-5" />
    </div>
  )
}

const MobileNavigationCatalogDynamic = dynamic(() => import('./catalog'), {
  ssr: false,
  loading: () => <MobileNavigationSkeleton />
})

const MobileNavigationPagesDynamic = dynamic(() => import('./pages'), {
  ssr: false,
  loading: () => <MobileNavigationSkeleton />
})

const MobileNavigationOfficeDynamic = dynamic(() => import('./office'), {
  ssr: false,
  loading: () => <MobileNavigationSkeleton />
})

const MenuComponents = {
  catalog: MobileNavigationCatalogDynamic,
  pages: MobileNavigationPagesDynamic,
  office: MobileNavigationOfficeDynamic
}

type MenuName = keyof typeof MenuComponents

interface MobileNavigationContextType {
  opened: MenuName | null
  open: (name: MenuName | null) => void
  close: () => void
}

const MobileNavigationContext = createContext<MobileNavigationContextType>(null!)

// массивы opened и loaded нужны, чтобы открытие каталога после меню создавало эффект открытия каталога поверх меню
// TODO: непонятно зачем высчитывать оффсеты, если можно сделать их через селектор has на рут элементе
export function MobileNavigation({ children }: PropsWithChildren) {
  const pathname = usePathname()
  const [offsetTop, setOffsetTop] = useState(0)
  const [offsetBottom, setOffsetBottom] = useState(0)
  const [opened, setOpened] = useState<MenuName | null>(null)
  const [loaded, setLoaded] = useState<MenuName[]>([])

  useEffect(() => {
    close()
  }, [pathname])

  const open = (name: MenuName | null) => {
    disableScroll()

    const headerToolbar = document.querySelector('[data-header-toolbar]')
    const headerSticky = document.querySelector('[data-header-sticky]')

    if (headerToolbar) {
      const { height } = headerToolbar.getBoundingClientRect()
      setOffsetBottom(height)
    }

    if (headerSticky) {
      const headerStickyRect = headerSticky.getBoundingClientRect()
      setOffsetTop(headerStickyRect.bottom)
    }

    setOpened(name)

    if (name) {
      setLoaded((prev) => {
        const value = [...prev]
        if (!value.includes(name)) {
          value.push(name)
        }
        return value
      })
    }
  }

  const close = () => {
    setOpened(null)
    enableScroll()
  }

  return (
    <MobileNavigationContext.Provider value={{ open, close, opened }}>
      {children}
      {Object.keys(MenuComponents).map((name) => {
        const _name = name as MenuName

        if (!loaded.includes(_name)) return null

        const Component = MenuComponents[_name]

        return createPortal(
          <div
            className={cn(styles.root, {
              [styles.opened]: opened === _name
            })}
            style={{
              top: `${offsetTop}px`,
              bottom: `${offsetBottom}px`
            }}
          >
            <Component />
          </div>,
          document.body
        )
      })}
    </MobileNavigationContext.Provider>
  )
}

export function useMobileNavigation() {
  return useContext(MobileNavigationContext)
}
