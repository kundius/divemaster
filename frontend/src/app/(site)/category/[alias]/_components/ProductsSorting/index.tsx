'use client'

import { parseAsString, useQueryState, useQueryStates } from 'nuqs'
import { useMemo } from 'react'
import styles from './index.module.scss'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

export function ProductsSorting() {
  const [filter, setFilter] = useQueryState('filter', parseAsString.withDefault('{}'))
  const [params, setParams] = useQueryStates(
    {
      sort: parseAsString.withDefault('id'),
      dir: parseAsString.withDefault('ASC')
    },
    {
      clearOnDefault: true
    }
  )
  const filtersCount = useMemo(() => {
    try {
      return Object.keys(JSON.parse(filter)).length
    } catch {
      return 0
    }
  }, [filter])

  const changeHandler = (value: string) => {
    const arr = value.split(':')
    const sort = arr[0] || 'id'
    const dir = arr[1] || 'ASC'
    setParams({ sort, dir })
  }

  const labels = {
    'id:ASC': 'По популярности',
    'price:ASC': 'Дешевле',
    'price:DESC': 'Дороже'
  }
  const labelKey = `${params.sort}:${params.dir}` as keyof typeof labels

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <Select onValueChange={changeHandler}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={labels[labelKey]} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="id:ASC">{labels['id:ASC']}</SelectItem>
            <SelectItem value="price:ASC">{labels['price:ASC']}</SelectItem>
            <SelectItem value="price:DESC">{labels['price:DESC']}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className={styles.filter}>
        <span className={styles.filterTitle}>Фильтр</span>
        {filtersCount > 0 && <span className={styles.filterCount}>{filtersCount}</span>}
        <span className={styles.filterIcon}>
          <svg viewBox="0 0 24 24" width="20" height="20">
            <use href="/sprite.svg#equalizer"></use>
          </svg>
        </span>
      </div>
    </div>
  )
}