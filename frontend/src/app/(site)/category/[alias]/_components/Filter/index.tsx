'use client'

import { parseAsString, useQueryState } from 'nuqs'
import { useMemo } from 'react'
import { useProductsQuery } from '../ProductsQuery'
import { FilterOptions } from './FilterOptions'
import { FilterToggle } from './FilterToggle'
import styles from './index.module.scss'
import { FilterRange } from './FilterRange'

export interface FilterProps {}

export function Filter(props: FilterProps) {
  const [filter, setFilter] = useQueryState('filter', parseAsString.withDefault('{}'))
  const { data, listRef } = useProductsQuery()
  const parsedFilter = useMemo(() => {
    try {
      return JSON.parse(filter) as Record<string, any>
    } catch {
      return {}
    }
  }, [filter])

  const changeHandler = (key: string, value: any) => {
    setFilter(
      JSON.stringify({
        ...parsedFilter,
        [key]: value
      })
    )
    // if (listRef.current) {
    //   listRef.current.scrollIntoView({ behavior: 'smooth' })
    // }
  }

  return (
    <div className={styles.container}>
      {data.filters.map((item) => {
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
