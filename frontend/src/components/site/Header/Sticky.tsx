'use client'

import { useElementVisibility } from '@reactuses/core'
import { PropsWithChildren, useRef } from 'react'

import styles from './Sticky.module.scss'

export function Sticky({ children }: PropsWithChildren) {
  const anchorRef = useRef<HTMLDivElement>(null)
  const [sticky] = useElementVisibility(anchorRef)

  return (
    <div className={styles.block} data-header-sticky={sticky}>
      <div className={styles.anchor} ref={anchorRef} />
      {children}
    </div>
  )
}
