'use client'

import { useElementVisibility } from '@reactuses/core'
import { PropsWithChildren, useRef } from 'react'

import styles from './Sticky.module.css'

export function Sticky({ children }: PropsWithChildren) {
  const anchorRef = useRef<HTMLDivElement>(null)
  const [anchorVisible] = useElementVisibility(anchorRef)

  return (
    <div className={styles.block} data-header-sticky={!anchorVisible}>
      <div className={styles.anchor} ref={anchorRef} />
      {children}
    </div>
  )
}
