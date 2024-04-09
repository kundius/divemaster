'use client'

import { cn, disableScroll, enableScroll } from '@/lib/utils'
import dynamic from 'next/dynamic'
import { ComponentType, PropsWithChildren, createContext, useContext, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './MobileNavigation.module.scss'

const MobileNavigationCatalogDynamic = dynamic(() => import('./MobileNavigationCatalog'), {
  ssr: false,
  loading: () => <>...</>
})

const MobileNavigationPagesDynamic = dynamic(() => import('./MobileNavigationPages'), {
  ssr: false,
  loading: () => <>...</>
})

type MenuName = 'catalog' | 'pages'

interface MobileNavigationContextType {
  opened: MenuName[]
  open: (name: MenuName) => void
  close: () => void
}

const MobileNavigationContext = createContext<MobileNavigationContextType>(null!)

export function MobileNavigation({ children }: PropsWithChildren) {
  const [offsetTop, setOffsetTop] = useState(0)
  const [offsetBottom, setOffsetBottom] = useState(0)
  const [opened, setOpened] = useState<MenuName[]>([])
  const [loaded, setLoaded] = useState<MenuName[]>([])

  const open = (name: MenuName) => {
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

    setOpened((prev) => {
      const value = [...prev]
      if (value.includes(name)) {
        delete value[value.indexOf(name)]
      }
      value.push(name)
      return value
    })

    setLoaded((prev) => {
      const value = [...prev]
      if (!value.includes(name)) {
        value.push(name)
      }
      return value
    })
  }

  const close = () => {
    setOpened([])

    enableScroll()
  }

  const components: { [key in MenuName]: ComponentType } = {
    catalog: MobileNavigationCatalogDynamic,
    pages: MobileNavigationPagesDynamic
  }

  return (
    <MobileNavigationContext.Provider value={{ open, close, opened }}>
      {Object.keys(components).map((name) => {
        const _name = name as MenuName
        const Component = components[_name]
        const isOpened = opened.includes(_name)
        const isLoaded = loaded.includes(_name)
        const zIndex = Math.max(opened.indexOf(_name), 0)

        if (!isLoaded) return null

        return createPortal(
          <div
            className={cn(styles.root, {
              [styles.opened]: isOpened
            })}
            style={{
              top: `${offsetTop}px`,
              bottom: `${offsetBottom}px`,
              zIndex
            }}
          >
            <Component />
          </div>,
          document.body
        )
      })}
      {children}
    </MobileNavigationContext.Provider>
  )
}

export function useMobileNavigation() {
  return useContext(MobileNavigationContext)
}
