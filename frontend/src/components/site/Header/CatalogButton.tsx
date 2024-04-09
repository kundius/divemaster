'use client'

import { useState } from 'react'
import styles from './CatalogButton.module.scss'
import { createPortal } from 'react-dom'
import { cn, disableScroll, enableScroll } from '@/lib/utils'

export function CatalogButton() {
  const [offsetTop, setOffsetTop] = useState(0)
  // const [offsetBottom, setOffsetBottom] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isOpened, setIsOpened] = useState(false)

  const handleToggle = () => {
    if (isOpened) {
      close()
    } else {
      open()
    }
  }

  const open = () => {
    disableScroll()

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

    enableScroll()
  }

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
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
              Component
              <br />
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
