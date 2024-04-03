'use client'

import { cn } from '@/lib/utils'
import styles from './Sticky.module.scss'
import { PropsWithChildren, useEffect, useRef } from 'react'

export function Sticky({ children }: PropsWithChildren) {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const blockRef = useRef<HTMLDivElement>(null)
  const anchorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      ([e]) => {
        blockRef.current?.toggleAttribute('data-stuck', e.intersectionRatio < 1)
      },
      { threshold: [1] }
    )
  }, [])

  useEffect(() => {
    const observer = observerRef.current
    const anchor = anchorRef.current

    if (!observer || !anchor) return

    observer.observe(anchor)

    return () => {
      observer.disconnect()
    }
  }, [anchorRef])

  return (
    <div className={cn(styles.block, 'sticky-header')} ref={blockRef}>
      <div className={styles.anchor} ref={anchorRef} />
      {children}
    </div>
  )
}
