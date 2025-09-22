'use client'

import { useEffect, useState } from 'react'
import styles from './CatalogButton.module.css'
import { createPortal } from 'react-dom'
import { cn, disableScroll, enableScroll } from '@/lib/utils'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'

const CatalogButtonContentDynamic = dynamic(() => import('./CatalogButtonContent'), {
  ssr: false,
  loading: () => <>...</>
})

export function CatalogButton() {
  const pathname = usePathname()
  const [offsetTop, setOffsetTop] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isOpened, setIsOpened] = useState(false)

  useEffect(() => {
    close()
  }, [pathname])

  const handleToggle = () => {
    if (isOpened) {
      close()
    } else {
      open()
    }
  }

  const open = () => {
    // disableScroll()

    setIsLoaded(true)

    const headerPrimary = document.querySelector('[data-header-primary]')

    if (headerPrimary) {
      const headerPrimaryRect = headerPrimary.getBoundingClientRect()
      setOffsetTop(headerPrimaryRect.bottom)
    }

    setIsOpened(true)
  }

  const close = () => {
    setIsOpened(false)

    // enableScroll()
  }

  useEffect(() => {
    if (isOpened) {
      window.addEventListener('scroll', close)
    } else {
      window.removeEventListener('scroll', close)
    }
    return () => {
      window.removeEventListener('scroll', close)
    }
  }, [isOpened])

  return (
    <>
      <button
        className={cn(styles.button, { [styles['button-opened']]: isOpened })}
        onClick={handleToggle}
      >
        Каталог<span className={styles.arrow}></span>
      </button>
      {isLoaded &&
        createPortal(
          <div
            className={cn(styles.modal, { [styles.opened]: isOpened })}
            style={{ '--offset-top': `${offsetTop}px` } as React.CSSProperties}
          >
            <div className={styles['modal-content']}>
              <CatalogButtonContentDynamic />
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
