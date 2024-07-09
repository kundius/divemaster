import { colors } from '@/lib/colors'
import { cn } from '@/lib/utils'
import { useElementSize, useToggle } from '@reactuses/core'
import { ChangeEvent, useRef } from 'react'
import { ProductsOptionsFilter } from '../ProductsQuery'
import styles from './FilterOptions.module.scss'

export interface FilterOptionsProps {
  filter: ProductsOptionsFilter
  selected?: string[]
  onSelect?: (value: string[]) => void
}

export function FilterOptions({ filter, onSelect, selected = [] }: FilterOptionsProps) {
  const [opened, openedToggle] = useToggle(selected.length > 0)

  const refContent = useRef<HTMLDivElement>(null)

  const [contentWidth, contentHeight] = useElementSize(refContent, { box: 'border-box' })

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    let set = new Set(selected)
    if (e.target.checked) {
      set.add(e.target.value)
    } else {
      set.delete(e.target.value)
    }
    onSelect?.(Array.from(set))
  }

  const renderColor = (value: string) => {
    const color = colors.find((color) => color.name === value)
    if (color) {
      return <span className={styles.color} style={{ backgroundColor: color.color }}></span>
    }
    return null
  }

  return (
    <div
      className={cn(styles.box, {
        [styles.boxOpened]: opened
      })}
    >
      <div className={styles.headline} onClick={openedToggle}>
        <div className={styles.title}>{filter.title}</div>
        {selected.length > 0 && <span className={styles.selectedCount}>{selected.length}</span>}
      </div>
      <div className={styles.body} style={{ maxHeight: opened ? contentHeight : 0 }}>
        <div className={styles.content} ref={refContent}>
          <div className={styles.options}>
            {filter.options.map((option) => (
              <label key={option.value} className={styles.option}>
                <input
                  type="checkbox"
                  value={option.value}
                  className={styles.input}
                  onChange={changeHandler}
                  checked={selected.includes(option.value)}
                />
                <span className={styles.checkbox}></span>
                {filter.variant === 'colors' && renderColor(option.value)}
                {option.value} <span className={styles.amount}>{option.amount}</span>
              </label>
            ))}
          </div>
          <button className={styles.reset}>Сбросить</button>
        </div>
      </div>
    </div>
  )
}
