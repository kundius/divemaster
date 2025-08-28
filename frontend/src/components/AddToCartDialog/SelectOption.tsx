'use client'

import { cn } from '@/lib/utils'
import styles from './SelectOption.module.css'

export interface SelectOptionProps {
  caption: string
  values?: string[]
  selected?: string
  onSelect?: (value: string) => void
}

export function SelectOption({ caption, values = [], selected, onSelect }: SelectOptionProps) {
  return (
    <div className={styles.control}>
      <div className={styles.caption}>{caption}</div>
      <div className={styles.values}>
        {values.map((value) => (
          <button
            key={value}
            className={cn(styles.value, {
              [styles.active]: selected === value
            })}
            onClick={() => onSelect?.(value)}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  )
}
