'use client'

import { cn } from '@/lib/utils'
import styles from './SelectColor.module.scss'
import { colors } from '@/lib/colors'
import { OptionValueEntity } from '@/types'

export interface SelectColorProps {
  caption: string
  values: OptionValueEntity[]
  selected?: OptionValueEntity
  onSelect?: (value: OptionValueEntity) => void
}

export function SelectColor({ caption, values, selected, onSelect }: SelectColorProps) {
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
                background: colors.find((color) => color.name === selected.content)?.color
              }}
            />
            <div className={styles.selectedText}>{selected.content}</div>
          </div>
        )}
      </div>
      <div className={styles.valuesContainer}>
        <div className={styles.values}>
          {values
            // .filter((item) => item !== selected)
            .map((value) => (
              <button key={value.id} className={styles.value} onClick={() => onSelect?.(value)}>
                <div
                  className={styles.valueColor}
                  style={{
                    background: colors.find((color) => color.name === value.content)?.color
                  }}
                />
                <div className={styles.valueText}>{value.content}</div>
              </button>
            ))}
        </div>
      </div>
    </div>
  )
}
