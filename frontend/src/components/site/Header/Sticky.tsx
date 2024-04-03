'use client'

import { cn } from '@/lib/utils'
import styles from './Sticky.module.scss'
import { PropsWithChildren, useEffect, useRef } from 'react'

export function Sticky({ children }: PropsWithChildren) {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const topAnchorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      ([e]) => {
        // console.log(e)
        wrapperRef.current?.toggleAttribute('data-stuck', e.intersectionRatio < 1)
      },
      { threshold: [1] }
    )
  }, [])

  useEffect(() => {
    const observer = observerRef.current
    const topAnchor = topAnchorRef.current

    if (!observer || !topAnchor) return

    observer.observe(topAnchor)

    return () => {
      observer.disconnect()
    }
  }, [topAnchorRef])

  return (
    <div className={cn(styles.block, 'sticky-header')} ref={wrapperRef}>
      <div className={styles['top-anchor']} ref={topAnchorRef} />
      {children}
    </div>
  )
}
