'use client'

import { Pagination } from '@/components/DataTable/Pagination'
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
import Link from 'next/link'
import { parseAsInteger, useQueryState } from 'nuqs'

export interface OrdersPaginationProps {
  total: number
  page: number
  limit: number
}

export function OrdersPagination({ total, page, limit }: OrdersPaginationProps) {
  const setPageIndex = (value: number) => {
    return `/dashboard/orders?page=${value}`
  }

  const getPageCount = () => {
    return Math.ceil((total || 0) / limit)
  }

  const previousPage = () => {
    return setPageIndex(page - 1)
  }

  const getCanPreviousPage = () => {
    return page > 1
  }

  const nextPage = () => {
    return setPageIndex(page + 1)
  }

  const getCanNextPage = () => {
    return getPageCount() > page
  }

  return (
    <div className="flex items-center flex-wrap gap-4 lg:gap-8">
      <div className="flex items-center justify-center text-sm font-medium">
        <span className="hidden sm:block mr-1">Страница</span>
        <span className="whitespace-nowrap">
          {page} из {getPageCount()}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          disabled={!getCanPreviousPage()}
          asChild
        >
          <Link href={setPageIndex(1)}>
            <span className="sr-only">В начало</span>
            <ChevronDoubleLeftIcon className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" className="h-8 w-8 p-0" disabled={!getCanPreviousPage()} asChild>
          <Link href={previousPage()}>
            <span className="sr-only">Назад</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" className="h-8 w-8 p-0" disabled={!getCanNextPage()} asChild>
          <Link href={nextPage()}>
            <span className="sr-only">Вперед</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Link>
        </Button>
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          disabled={!getCanNextPage()}
          asChild
        >
          <Link href={setPageIndex(getPageCount())}>
            <span className="sr-only">В конец</span>
            <ChevronDoubleRightIcon className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
