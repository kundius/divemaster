'use client'

import { useMemo } from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useProductsStore } from '@/providers/products-store-provider'

import styles from './index.module.scss'

export function Sorting() {
  const filter = useProductsStore((state) => state.filter)
  const sort = useProductsStore((state) => state.sort)
  const dir = useProductsStore((state) => state.dir)
  const onChangeSort = useProductsStore((state) => state.onChangeSort)

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
    const dir = arr[1] || 'asc'
    onChangeSort(sort, dir)
  }

  const labels = {
    'id:asc': 'По популярности',
    'price:asc': 'Дешевле',
    'price:desc': 'Дороже'
  }
  const labelKey = `${sort}:${dir}` as keyof typeof labels

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <Select onValueChange={changeHandler}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={labels[labelKey]} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="id:asc">{labels['id:asc']}</SelectItem>
            <SelectItem value="price:asc">{labels['price:asc']}</SelectItem>
            <SelectItem value="price:desc">{labels['price:desc']}</SelectItem>
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
