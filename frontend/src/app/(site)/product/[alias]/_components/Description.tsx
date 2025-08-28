'use client'

import Link from 'next/link'
import styles from './Description.module.css'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

export interface DescriptionProps {
  title: string
  content: string
}

export function Description({ title, content }: DescriptionProps) {
  const [minHeight, setMinxHeight] = useState(0)
  const [maxHeight, setMaxHeight] = useState(0)
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [isNeedCollapse, setIsNeedCollapse] = useState(true)

  const contentRef = useRef<HTMLDivElement | null>(null)
  const collapseRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const contentEl = contentRef.current
    const collapseEl = collapseRef.current

    if (!contentEl || !collapseEl) return

    setMinxHeight(collapseEl.offsetHeight)
    setMaxHeight(contentEl.offsetHeight)
    setIsNeedCollapse(contentEl.offsetHeight > collapseEl.offsetHeight)
  }, [])

  const showHandler = () => {
    if (!collapseRef.current) return
    collapseRef.current.style.maxHeight = maxHeight + 'px'
    setIsCollapsed(false)
  }

  const closeHandler = () => {
    if (!collapseRef.current) return
    collapseRef.current.style.maxHeight = minHeight + 'px'
    setIsCollapsed(true)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.title} id={title}>
        {title}
      </div>
      <div
        className={cn(styles.collapse, { [styles.shaded]: isCollapsed && isNeedCollapse })}
        ref={collapseRef}
      >
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: content }}
          ref={contentRef}
        />
      </div>
      {isNeedCollapse && (
        <div className={styles.showMore}>
          {isCollapsed ? (
            <button className={styles.showMoreButton} onClick={showHandler}>
              <span>Показать еще</span>
            </button>
          ) : (
            <button
              className={cn(styles.showMoreButton, styles.showMoreButtonClose)}
              onClick={closeHandler}
            >
              <span>Свернуть</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
