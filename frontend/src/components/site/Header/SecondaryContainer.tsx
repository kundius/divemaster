'use client'

import { usePathname } from 'next/navigation'
import { PropsWithChildren } from 'react'

import styles from './index.module.scss'

export function SecondaryContainer({ children }: PropsWithChildren) {
  const pathname = usePathname()
  if (pathname.startsWith('/cart')) {
    return null
  }
  if (pathname.startsWith('/order')) {
    return null
  }
  return (
    <div className={styles['secondary-container']} data-header-secondary="">
      {children}
    </div>
  )
}
