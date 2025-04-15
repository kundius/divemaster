'use client'

import { cn } from '@/lib/utils'
import styles from './MenuButton.module.scss'
import { useMobileNavigation } from '@/components/MobileNavigation'

export function MenuButton() {
  const mobileNavigation = useMobileNavigation()

  const handleClick = () => {
    if (mobileNavigation.opened) {
      mobileNavigation.close()
    } else {
      mobileNavigation.open('pages')
    }
  }

  return (
    <>
      <button
        className={cn(styles.button, {
          [styles.close]: mobileNavigation.opened
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
