'use client'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { PageHeader, PageHeaderProps } from '../PageHeader'
import { useQuery } from '@tanstack/react-query'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
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
import { changeSearchParams, patamsFromSearchParams } from './utils'
import { TablePageData, TablePageProps, TablePageParams } from './types'

const actions: PageHeaderProps['actions'] = [
  {
    title: 'Добавить роль',
    route: '/admin/user-roles/create'
  }
]

export function TablePage<TRow = unknown>({
  action,
  initialData,
  idKey,
  title,
  sectionPath
}: TablePageProps<TRow>) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const params = useMemo<TablePageParams>(
    () => patamsFromSearchParams(searchParams),
    [searchParams]
  )

  const changeParams = useCallback(
    (values: Partial<TablePageParams>) => changeSearchParams(searchParams, values),
    [searchParams]
  )

  const { data, isPending, error } = useQuery<TablePageData<TRow>>({
    initialData,
    // placeholderData: (data) => data,
    queryKey: [pathname, ...Object.entries(params).map((e) => e.join(':'))],
    queryFn: () => action(params)
  })

  // if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  const setPageSize = (limit: number) => {
    changeParams({
      page: 1,
      limit
    })
  }

  const setPageIndex = (page: number) => {
    changeParams({ page })
  }

  const getPageCount = () => {
    return Math.ceil((data?.total || 0) / params.limit)
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
    <div>
      <PageHeader
        title={title}
        actions={[
          {
            title: 'Добавить',
            route: `${sectionPath}/create`
          }
        ]}
      />

      <div className="space-y-4">
        <div>
          {data?.total} - {params.page}
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Invoice</TableHead>
                {/* <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Amount</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.rows.map((row) => (
                <TableRow key={String(row[idKey])}>
                  <TableCell className="font-medium">{row.title}</TableCell>
                  {/* <TableCell>{invoice.paymentStatus}</TableCell>
                <TableCell>{invoice.paymentMethod}</TableCell>
                <TableCell className="text-right">{invoice.totalAmount}</TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between px-2">
          <div className="flex-1 text-sm text-muted-foreground">
            {/* {table.getFilteredSelectedRowModel().rows.length} of{" "} */}
            {/* {table.getFilteredRowModel().rows.length} row(s) selected. */}
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">На странице</p>
              <Select
                value={`${params.limit}`}
                onValueChange={(value) => setPageSize(Number(value))}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={params.limit} />
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
            <div className="flex whitespace-nowrap items-center justify-center text-sm font-medium">
              Страница {params.page} из {getPageCount()}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => setPageIndex(1)}
                disabled={!getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronDoubleLeftIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => previousPage()}
                disabled={!getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => nextPage()}
                disabled={!getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => setPageIndex(getPageCount())}
                disabled={!getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronDoubleRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
