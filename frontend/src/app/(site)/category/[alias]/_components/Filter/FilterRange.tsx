import { Slider } from '@/components/ui/slider'
import styles from './FilterRange.module.scss'
import { ProductsRangeFilter } from '../ProductsQuery'
import { useState } from 'react'

export interface FilterRangeProps {
  filter: ProductsRangeFilter
  value?: [number, number]
  onChange?: (value?: [number, number]) => void
}

export function FilterRange({ filter, value, onChange }: FilterRangeProps) {
  const [controlledValue, onControlledChange] = useState<[number, number]>(value || filter.range)
  const [from, setFrom] = useState(String(value ? value[0] : filter.range[0]))
  const [to, setTo] = useState(String(value ? value[1] : filter.range[1]))

  const resetHandler = () => {
    onChange?.(undefined)
    onControlledChange(filter.range)
    setFrom(String(filter.range[0]))
    setTo(String(filter.range[1]))
  }

  return (
    <div className={styles.box}>
      <div className={styles.headline}>
        <div className={styles.title}>{filter.title}</div>
        <button className={styles.reset} onClick={resetHandler}>
          Сбросить
        </button>
      </div>
      <div className={styles.control}>
        <Slider
          value={controlledValue}
          onValueChange={(v) => {
            onControlledChange([v[0], v[1]])
            setFrom(String(v[0]))
            setTo(String(v[1]))
          }}
          onValueCommit={(v) => {
            onChange?.([v[0], v[1]])
          }}
          min={filter.range[0]}
          max={filter.range[1]}
          step={1}
        />
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <div className={styles.label}>от</div>
          <div className={styles.field}>
            <input
              type="number"
              className={styles.input}
              value={from}
              onChange={(e) => {
                setFrom(e.target.value)
                if (!!e.target.value) {
                  onControlledChange([Math.max(Math.min(Number(e.target.value), filter.range[1]), filter.range[0]), controlledValue[1]])
                }
              }}
              onBlur={(e) => {
                const calcValue = Math.max(Math.min(Number(e.target.value), filter.range[1]), filter.range[0])
                onChange?.([calcValue, controlledValue[1]])
                onControlledChange([calcValue, controlledValue[1]])
                setFrom(String(calcValue))
              }}
            />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className={styles.label}>до</div>
          <div className={styles.field}>
            <input
              type="number"
              className={styles.input}
              value={to}
              onChange={(e) => {
                setTo(e.target.value)
                if (!!e.target.value) {
                  onControlledChange([controlledValue[0], Math.max(Math.min(Number(e.target.value), filter.range[1]), filter.range[0])])
                }
              }}
              onBlur={(e) => {
                const calcValue = Math.max(Math.min(Number(e.target.value), filter.range[1]), filter.range[0])
                onChange?.([controlledValue[0], calcValue])
                onControlledChange([controlledValue[0], calcValue])
                setTo(String(calcValue))
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
