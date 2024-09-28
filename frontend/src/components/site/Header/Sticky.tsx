'use client'

import styles from './Sticky.module.scss'
import { PropsWithChildren, useEffect, useRef, useState } from 'react'

export function Sticky({ children }: PropsWithChildren) {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const anchorRef = useRef<HTMLDivElement>(null)
  const [sticky, setSticky] = useState(false)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      ([e]) => {
        setSticky(e.intersectionRatio < 1)
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
    <div className={styles.block} data-header-sticky={sticky}>
      <div className={styles.anchor} ref={anchorRef} />
      {children}
    </div>
  )
}
