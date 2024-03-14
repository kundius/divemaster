'use client'

import { Button } from '@/components/ui/button'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { FacetedFilter } from './FacetedFilter'
import { SearchFilter } from './SearchFilter'
import type { FilterProps, FilterValue } from './types'

// TODO: 
// сделать самостоятельным компонентом
// принимает набор фильтров fields
// значения фильтра типизировать дженериком
// в качестве типа фильтра принимать компонент
// фсе фильтры сделать по единому интерфейсу

export function Filter(props: FilterProps) {
  const { value = {}, onChange, filters = [] } = props

  const [isModified, setIsModified] = useState(false)
  const [localValue, setLocalValue] = useState<FilterValue>(value)

  const handleChange = (key: string, value: FilterValue[0]) => {
    setLocalValue((prev) => ({ ...prev, [key]: value }))
    setIsModified(true)
  }

  const handleSubmit = () => {
    onChange?.(localValue)
    setIsModified(false)
  }

  const handleReset = () => {
    setLocalValue({})
    onChange?.({})
    setIsModified(false)
  }

  const isNotEmpty = () => {
    if (!!Object.values(localValue).find((v) => !!v)) {
      return true
    }
    if (!!Object.values(value).find((v) => !!v)) {
      return true
    }
    return false
  }

  return (
    <div className="flex items-center flex-wrap gap-2">
      {filters.map((item, i) => {
        const key = `${item.name}-${i}`
        const value = localValue[item.name]

        if (item.type === 'search') {
          return (
            <SearchFilter
              key={key}
              placeholder={item.placeholder}
              value={typeof value === 'object' ? value[0] : value}
              onChange={handleChange.bind(null, item.name)}
            />
          )
        }

        if (item.type === 'faceted') {
          return (
            <FacetedFilter
              key={key}
              title={item.title}
              options={item.options}
              value={typeof value === 'string' ? [value] : value}
              onChange={handleChange.bind(null, item.name)}
            />
          )
        }
      })}

      <div className="flex items-center gap-2 ml-auto">
        {isNotEmpty() && (
          <Button onClick={handleReset} variant="ghost" className="flex gap-2">
            Сбросить <XMarkIcon className="w-4 h-4" />
          </Button>
        )}
        <Button onClick={handleSubmit} variant="outline" disabled={!isModified}>
          Применить
        </Button>
      </div>
    </div>
  )
}
