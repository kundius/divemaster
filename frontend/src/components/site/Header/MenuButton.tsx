'use client'

import { cn } from '@/lib/utils'
import styles from './MenuButton.module.scss'
import { useMobileNavigation } from './MobileNavigation'

export function MenuButton() {
  const mobileNavigation = useMobileNavigation()

  const handleClick = () => {
    if (mobileNavigation.opened.length > 0) {
      mobileNavigation.close()
    } else {
      mobileNavigation.open('pages')
    }
  }

  return (
    <>
      <button
        className={cn(styles.button, {
          [styles.close]: mobileNavigation.opened.length > 0
        })}
        onClick={handleClick}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </>
  )
}
