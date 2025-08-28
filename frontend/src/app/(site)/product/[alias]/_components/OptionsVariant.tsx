'use client'

import { cn } from '@/lib/utils'
import styles from './OptionsVariant.module.css'

export interface OptionsVariantProps {
  caption: string
  items: string[]
  selected?: string
  onSelect?: (value: string) => void
}

export function OptionsVariant({ caption, items, selected, onSelect }: OptionsVariantProps) {
  // const listRef = useRef<HTMLDivElement>(null)
  // const [width, setWidth] = useState<number>()

  // useLayoutEffect(() => {
  //   if (!listRef.current) return

  //   let maxWidth = 0
  //   Array.from(listRef.current.children).forEach((child) => {
  //     const { width } = child.getBoundingClientRect()
  //     if (width > maxWidth) maxWidth = width
  //   })

  //   setWidth(maxWidth)
  // }, [listRef])

  return (
    <div className={styles.control}>
      <div className={styles.caption}>{caption}</div>
      <div className={styles.values}>
        {items.map((item) => (
          <button
            key={item}
            className={cn(styles.value, {
              [styles.active]: selected === item
            })}
            onClick={() => onSelect?.(item)}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  )
}
