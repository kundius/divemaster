'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useResorces } from '.'

export function Pagination() {
  const { params, total, setParams } = useResorces()

  const onChange = (page: number, limit: number) => {
    setParams({
      ...params,
      page,
      limit
    })
  }

  const setPageSize = (value: number) => {
    onChange?.(params.page, value)
  }

  const setPageIndex = (value: number) => {
    onChange?.(value, params.limit)
  }

  const getPageCount = () => {
    return Math.ceil((total || 0) / params.limit)
  }

  const previousPage = () => {
    setPageIndex(params.page - 1)
  }

  const getCanPreviousPage = () => {
    return params.page > 1
  }

  const nextPage = () => {
    setPageIndex(params.page + 1)
  }

  const getCanNextPage = () => {
    return getPageCount() > params.page
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        className="h-8 w-8 p-0"
        onClick={() => previousPage()}
        disabled={!getCanPreviousPage()}
      >
        <span className="sr-only">Назад</span>
        <ChevronLeftIcon className="h-4 w-4" />
      </Button>
      {Array(getPageCount())
        .fill(null)
        .map((_, i) => (
          <Button
            key={i}
            variant={i + 1 === params.page ? 'default' : 'outline'}
            className="h-8 w-8 p-0"
            onClick={() => setPageIndex(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
      <Button
        variant="outline"
        className="h-8 w-8 p-0"
        onClick={() => nextPage()}
        disabled={!getCanNextPage()}
      >
        <span className="sr-only">Вперед</span>
        <ChevronRightIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}
