'use client'

import { Button } from '@/components/ui/button'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { SearchFilter, SearchFilterProps } from './SearchFilter'
import { FacetedFilter, FacetedFilterProps } from './FacetedFilter'

// TODO:
// значения фильтров не типизированы (надо ли?)

export interface FilterSearchField extends Omit<SearchFilterProps, 'onChange' | 'value'> {
  type: 'search'
  name: string
}

export interface FilterFacetedField extends Omit<FacetedFilterProps, 'onChange' | 'value'> {
  type: 'faceted'
  name: string
}

export type FilterField = FilterSearchField | FilterFacetedField

export type FilterValue = { [key: string]: string | string[] | undefined }

export interface FilterProps {
  fields?: FilterField[]
  value?: FilterValue
  onChange?: (value?: FilterValue) => void
}

export function Filter(props: FilterProps) {
  const { value, onChange, fields = [] } = props

  const [isModified, setIsModified] = useState(false)
  const [localValue, setLocalValue] = useState<FilterValue | undefined>(value)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleChange = (key: string, value: FilterValue[0]) => {
    setLocalValue((prev) => ({ ...prev, [key]: value }))
    setIsModified(true)
  }

  const handleSubmit = () => {
    onChange?.(localValue)
    setIsModified(false)
  }

  const handleReset = () => {
    setLocalValue(undefined)
    onChange?.(undefined)
    setIsModified(false)
  }

  const isNotEmpty = () => {
    if (!!Object.values(localValue || {}).find((v) => !!v)) {
      return true
    }
    if (!!Object.values(value || {}).find((v) => !!v)) {
      return true
    }
    return false
  }

  const renderField = (item: FilterField, i: number) => {
    const key = `${item.name}-${i}`
    const onChange = handleChange.bind(null, item.name)
    let value = localValue?.[item.name]
    switch (item.type) {
      case 'faceted':
        if (typeof value === 'string') {
          value = [value]
        }
        return (
          <FacetedFilter
            key={key}
            options={item.options}
            title={item.title}
            value={value}
            onChange={onChange}
          />
        )
      case 'search':
        if (typeof value === 'object') {
          value = value.join(',')
        }
        return (
          <SearchFilter
            key={key}
            placeholder={item.placeholder}
            value={value}
            onChange={onChange}
          />
        )
    }
  }

  return (
    <div className="flex items-center flex-wrap gap-2">
      {fields.map(renderField)}

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
