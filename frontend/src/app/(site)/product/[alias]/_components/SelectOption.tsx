'use client'

import { cn } from '@/lib/utils'
import styles from './SelectOption.module.scss'
import { OptionValueEntity } from '@/types'

export interface SelectOptionProps {
  caption: string
  values: OptionValueEntity[]
  selected?: OptionValueEntity
  onSelect?: (value: OptionValueEntity) => void
}

export function SelectOption({ caption, values, selected, onSelect }: SelectOptionProps) {
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
        {values.map((value) => (
          <button
            key={value.id}
            className={cn(styles.value, {
              [styles.active]: selected?.id === value.id
            })}
            onClick={() => onSelect?.(value)}
          >
            {value.content}
          </button>
        ))}
      </div>
    </div>
  )
}
