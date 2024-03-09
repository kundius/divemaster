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

export interface PaginationProps {
  limit: number
  page: number
  total: number
  onChange?: (page: number, limit: number) => void
}

export function Pagination(props: PaginationProps) {
  const { limit, page, total, onChange } = props

  const setPageSize = (value: number) => {
    onChange?.(page, value)
  }

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
    <div className="flex items-center flex-wrap gap-4 lg:gap-8">
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium hidden md:block">На странице</p>
        <Select value={`${limit}`} onValueChange={(value) => setPageSize(Number(value))}>
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={limit} />
          </SelectTrigger>
          <SelectContent side="top">
            {[2, 10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="whitespace-nowrap items-center justify-center text-sm font-medium hidden md:block">
        Страница {page} из {getPageCount()}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => setPageIndex(1)}
          disabled={!getCanPreviousPage()}
        >
          <span className="sr-only">В начало</span>
          <ChevronDoubleLeftIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => previousPage()}
          disabled={!getCanPreviousPage()}
        >
          <span className="sr-only">Назад</span>
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => nextPage()}
          disabled={!getCanNextPage()}
        >
          <span className="sr-only">Вперед</span>
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => setPageIndex(getPageCount())}
          disabled={!getCanNextPage()}
        >
          <span className="sr-only">В конец</span>
          <ChevronDoubleRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
