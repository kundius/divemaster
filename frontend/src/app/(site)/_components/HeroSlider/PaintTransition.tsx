import { useState, useEffect, useCallback, ReactNode, Children } from 'react'
import styles from './PaintTransition.module.css'

interface Props {
  /** Ровно 2 дочерних элемента */
  children: [ReactNode, ReactNode]
  /** Период переключения (мс) */
  interval?: number
  /** Длительность анимации */
  duration?: string
  className?: string
}

export function PaintTransition({
  children,
  interval = 3000,
  duration = '1s',
  className = ''
}: Props) {
  const [isVisible, setIsVisible] = useState(false)
  const [center, setCenter] = useState({ x: 50, y: 50 })
  const [childA, childB] = Children.toArray(children)

  const randomizeCenter = useCallback(() => {
    setCenter({ x: Math.random() * 100, y: Math.random() * 100 })
  }, [])

  useEffect(() => {
    randomizeCenter()
    const timer = setInterval(() => {
      randomizeCenter()
      setIsVisible((prev) => !prev)
    }, interval)
    return () => clearInterval(timer)
  }, [interval, randomizeCenter])

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.back}>{childA}</div>
      <div
        className={`${styles.front} ${isVisible ? styles.active : ''}`}
        style={
          {
            '--x': `${center.x}%`,
            '--y': `${center.y}%`,
            '--duration': duration
          } as React.CSSProperties
        }
      >
        {childB}
      </div>
    </div>
  )
}
