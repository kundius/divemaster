'use client'

import { useProductsStore } from '@/providers/products-store-provider'
import { useMemo } from 'react'
import { FilterOptions } from './FilterOptions'
import { FilterRange } from './FilterRange'
import { FilterToggle } from './FilterToggle'
import styles from './index.module.scss'

export function Filter() {
  const filters = useProductsStore((state) => state.data.filters)
  const filter = useProductsStore((state) => state.searchParams.filter)
  const onChangeFilter = useProductsStore((state) => state.onChangeFilter)

  const parsedFilter = useMemo(() => {
    try {
      return JSON.parse(filter) as Record<string, any>
    } catch {
      return {}
    }
  }, [filter])

  const changeHandler = (key: string, value: any) => {
    onChangeFilter(
      JSON.stringify({
        ...parsedFilter,
        [key]: value
      })
    )
  }

  return (
    <div className={styles.container}>
      {filters.map((item) => {
        if (item.type === 'range') {
          return (
            <FilterRange
              filter={item}
              key={item.name}
              value={parsedFilter?.[item.name]}
              onChange={(value) => changeHandler(item.name, value ? value : undefined)}
            />
          )
        }
        if (item.type === 'toggle') {
          return (
            <FilterToggle
              filter={item}
              key={item.name}
              checked={!!parsedFilter?.[item.name]}
              onCheckedChange={(value) => changeHandler(item.name, value ? value : undefined)}
            />
          )
        }
        if (item.type === 'options') {
          return (
            <FilterOptions
              filter={item}
              key={item.name}
              selected={parsedFilter?.[item.name]}
              onSelect={(value) => changeHandler(item.name, value.length > 0 ? value : undefined)}
            />
          )
        }
        return null
      })}
    </div>
  )
}
