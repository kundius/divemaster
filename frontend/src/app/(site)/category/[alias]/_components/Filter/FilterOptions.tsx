import { colors } from '@/lib/colors'
import { cn } from '@/lib/utils'
import { useElementSize, useToggle } from '@reactuses/core'
import { ChangeEvent, useRef } from 'react'
import styles from './FilterOptions.module.scss'
import { ProductsOptionsFilter } from '@/types'

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
    const set = new Set(selected)
    if (e.target.checked) {
      set.add(e.target.value)
    } else {
      set.delete(e.target.value)
    }
    onSelect?.(Array.from(set))
  }

  const resetHandler = () => {
    onSelect?.([])
  }

  const renderColor = (value: string) => {
    const color = colors.find((color) => color.name === value)
    if (color) {
      return <span className={styles.optionColor} style={{ backgroundColor: color.color }}></span>
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
              <label
                key={option.value}
                className={cn(styles.option, {
                  [styles.optionDisabled]: option.quantity === 0
                })}
              >
                <input
                  type="checkbox"
                  value={option.value}
                  className={styles.optionInput}
                  onChange={option.quantity > 0 ? changeHandler : () => {}}
                  checked={selected.includes(option.value)}
                />
                <span className={styles.optionCheckbox}></span>
                {filter.variant === 'colors' && renderColor(option.value)}
                <span className={styles.optionValue}>{option.value}</span>
                <span className={styles.optionQuantity}>{option.quantity}</span>
              </label>
            ))}
          </div>
          {selected.length > 0 && (
            <button className={styles.reset} onClick={resetHandler}>
              Сбросить
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
