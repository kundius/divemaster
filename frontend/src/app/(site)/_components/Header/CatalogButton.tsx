'use client'

import { useEffect, useRef, useState } from 'react'
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
  const modalRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

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

  const handlePointerDown = (event: PointerEvent) => {
    if (
      modalRef.current &&
      !modalRef.current.contains(event.target as Node) &&
      triggerRef.current &&
      !triggerRef.current.contains(event.target as Node)
    ) {
      close()
    }
  }

  useEffect(() => {
    if (isOpened) {
      document.addEventListener('pointerdown', handlePointerDown)
      window.addEventListener('scroll', close)
    } else {
      document.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('scroll', close)
    }
    return () => {
      window.removeEventListener('scroll', close)
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isOpened])

  return (
    <>
      <button
        className={cn(styles.button, { [styles['button-opened']]: isOpened })}
        onClick={handleToggle}
        ref={triggerRef}
      >
        Каталог<span className={styles.arrow}></span>
      </button>
      {isLoaded &&
        createPortal(
          <div
            className={cn(styles.modal, { [styles.opened]: isOpened })}
            style={{ '--offset-top': `${offsetTop}px` } as React.CSSProperties}
            ref={modalRef}
            // onPointerDownOutside={() => {
            //   setIsOpen(false)
            //   setHighlightedIndex(-1)
            // }}
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
