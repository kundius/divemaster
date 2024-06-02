'use client'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'
import styles from './index.module.scss'
import { cn } from '@/lib/utils'

export interface PaginationProps {
  limit: number
  page: number
  total: number
  onChange?: (page: number, limit: number) => void
}

export function Pagination(props: PaginationProps) {
  const { limit, page, total, onChange } = props

  const setPageIndex = (value: number) => {
    onChange?.(value, limit)
  }

  const getPageCount = () => {
    return Math.ceil((total || 0) / limit)
  }

  const previousPage = () => {
    setPageIndex(page - 1)
  }

  const getCanPreviousPage = () => {
    return page > 1
  }

  const nextPage = () => {
    setPageIndex(page + 1)
  }

  const getCanNextPage = () => {
    return getPageCount() > page
  }

  return (
    <div className={styles.wrapper}>
      <button
        onClick={() => previousPage()}
        disabled={!getCanPreviousPage()}
        className={cn(styles.previous, styles.button)}
      >
        <span className="sr-only">Назад</span>
        <ChevronLeftIcon className="h-4 w-4" />
      </button>
      {Array(getPageCount())
        .fill(null)
        .map((_, i) => (
          <button
            key={i}
            className={cn(styles.button, styles.page, {
              [styles.active]: i + 1 === page
            })}
            onClick={() => setPageIndex(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      <button
        className={cn(styles.next, styles.button)}
        onClick={() => nextPage()}
        disabled={!getCanNextPage()}
      >
        <span className="sr-only">Вперед</span>
        <ChevronRightIcon className="h-4 w-4" />
      </button>
    </div>
  )
}
