'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useProductsStore } from '@/providers/products-store-provider'
import styles from './index.module.css'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function ProductsSorting() {
  const filter = useProductsStore((state) => state.searchParams.filter)
  const stickyFilterToggle = useProductsStore((state) => state.stickyFilterToggle)
  const sort = useProductsStore((state) => state.searchParams.sort)
  const dir = useProductsStore((state) => state.searchParams.dir)
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
    const sort = arr[0] || 'title'
    const dir = arr[1] || 'ASC'
    onChangeSort(sort, dir)
  }

  const labels = {
    'rank:ASC': 'По умолчанию',
    'title:ASC': 'По названию',
    'minPrice:ASC': 'Дешевле',
    'minPrice:DESC': 'Дороже'
  }
  const labelKey = `${sort}:${dir}` as keyof typeof labels

  return (
    <div className={cn('flex justify-between items-center mb-8 max-md:mb-6', styles.wrap)}>
      <div>
        <Select onValueChange={changeHandler}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={labels[labelKey]} />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(labels).map(([key, value]) => (
              <SelectItem key={key} value={key}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        variant="outline"
        type="button"
        className="rounded-full"
        onClick={() => stickyFilterToggle()}
      >
        Фильтр
        {filtersCount > 0 && <span className={styles.filterCount}>{filtersCount}</span>}
        <span className={styles.filterIcon}>
          <span className="icon icon-equalizer" />
        </span>
      </Button>
    </div>
  )
}
