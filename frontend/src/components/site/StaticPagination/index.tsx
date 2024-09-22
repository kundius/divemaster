import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

import { cn } from '@/lib/utils'

import styles from './index.module.scss'

export interface StaticPaginationProps {
  defaultPage?: number
  pagedKey?: string
  limit: number
  page: number
  total: number
  baseUrl?: string
  searchParams?: {
    [key: string]: string | string[] | undefined
  }
}

export function StaticPagination(props: StaticPaginationProps) {
  const {
    defaultPage = 1,
    pagedKey = 'page',
    limit,
    page,
    total,
    baseUrl,
    searchParams = {}
  } = props

  const pageUrl = (value: number) => {
    let params = new URLSearchParams()
    Object.entries(searchParams).forEach(([k, v]) => {
      if (typeof v === 'undefined') return
      if (Array.isArray(v)) {
        v.forEach((vv) => params.append(k, vv))
      }
      if (typeof v === 'string') {
        params.set(k, v)
      }
    })
    if (value === defaultPage) {
      params.delete(pagedKey)
    } else {
      params.set(pagedKey, String(value))
    }
    return [baseUrl, params].filter((v) => v).join('?')
  }

  const pageCount = () => {
    return Math.ceil((total || 0) / limit)
  }

  const previousPage = () => {
    return pageUrl(page - 1)
  }

  const nextPage = () => {
    return pageUrl(page + 1)
  }

  const canPreviousPage = () => {
    return page > 1
  }

  const canNextPage = () => {
    return pageCount() > page
  }

  return (
    <div className={styles.wrapper}>
      {canPreviousPage() && (
        <Link href={previousPage()} className={cn(styles.previous, styles.button)}>
          <span className="sr-only">Назад</span>
          <ChevronLeftIcon className="h-4 w-4" />
        </Link>
      )}
      {Array(pageCount())
        .fill(null)
        .map((_, i) => (
          <Link
            key={i}
            className={cn(styles.button, styles.page, {
              [styles.active]: i + 1 === page
            })}
            href={pageUrl(i + 1)}
          >
            {i + 1}
          </Link>
        ))}
      {canNextPage() && (
        <Link className={cn(styles.next, styles.button)} href={nextPage()}>
          <span className="sr-only">Вперед</span>
          <ChevronRightIcon className="h-4 w-4" />
        </Link>
      )}
    </div>
  )
}
