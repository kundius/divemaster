'use client'

import { cn } from '@/lib/utils'
import styles from './SelectOption.module.scss'
import { OptionType, OptionValueEntity } from '@/types'
import { colorsObject } from '@/lib/colors'

export interface SelectOptionProps {
  type: OptionType
  caption: string
  values?: OptionValueEntity[]
  selected?: OptionValueEntity
  onSelect?: (value: OptionValueEntity) => void
}

export function SelectOption({
  caption,
  type,
  values = [],
  selected,
  onSelect
}: SelectOptionProps) {
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
      <div className={styles.valuesContainer}>
        <div className={styles.values}>
          {values.map((value) => (
            <button
              key={value.id}
              className={cn(styles.value, {
                [styles.active]: selected?.id === value.id
              })}
              onClick={() => onSelect?.(value)}
            >
              {type === OptionType.COMBOCOLORS && (
                <span
                  className={styles.color}
                  style={{ backgroundColor: colorsObject[value.content] }}
                />
              )}
              {value.content}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
