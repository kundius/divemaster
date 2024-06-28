'use client'

import { cn } from '@/lib/utils'
import styles from './OptionsColor.module.scss'
import { colors } from '@/lib/colors'

export interface OptionsColorProps {
  caption: string
  items: string[]
  selected?: string
  onSelect?: (value: string) => void
}

export function OptionsColor({ caption, items, selected, onSelect }: OptionsColorProps) {
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

  // const selectedValue = selected || items[0]

  return (
    <div className={styles.control}>
      <div className={styles.headline}>
        <div className={styles.caption}>
          {caption}
          {selected ? ':' : ''}
        </div>
        {selected && (
          <div className={styles.selected}>
            <div
              className={styles.selectedColor}
              style={{
                background: colors.find((color) => color.name === selected)?.color
              }}
            />
            <div className={styles.selectedText}>{selected}</div>
          </div>
        )}
      </div>
      <div className={styles.valuesContainer}>
        <div className={styles.values}>
          {items
            // .filter((item) => item !== selected)
            .map((item) => (
              <button key={item} className={styles.value} onClick={() => onSelect?.(item)}>
                <div
                  className={styles.valueColor}
                  style={{
                    background: colors.find((color) => color.name === item)?.color
                  }}
                />
                <div className={styles.valueText}>{item}</div>
              </button>
            ))}
        </div>
      </div>
    </div>
  )
}
