'use client'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { ArrowDownIcon, ArrowUpIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import { ReactNode } from 'react'
import { Pagination } from './Pagination'

export type DataTableColumn<T> = {
  [K in keyof T]: {
    label?: string
    headProps?: React.ThHTMLAttributes<HTMLTableCellElement>
    cellProps?: React.TdHTMLAttributes<HTMLTableCellElement>
    key: K
    sortable?: boolean
    formatter?: (value: T[K]) => ReactNode
  }
}[keyof T]

export interface DataTableProps<TRow> {
  columns?: DataTableColumn<TRow>[]
  data?: TRow[]
  keyId?: keyof TRow
  pagination?: {
    limit: number
    page: number
    total: number
  }
  onChangePagination?: (page: number, limit: number) => void
  sorting?: {
    sort?: string
    dir?: string
  }
  onChangeSorting?: (sort?: string, dir?: string) => void
}

export function DataTable<TRow extends object = object>(props: DataTableProps<TRow>) {
  const {
    keyId,
    data = [],
    columns = [],
    pagination,
    onChangePagination,
    sorting,
    onChangeSorting
  } = props

  const changeSortHandler = (column: DataTableColumn<TRow>) => {
    if (!onChangeSorting) return

    const field = String(column.key)

    if (sorting?.sort === field && sorting?.dir === 'ASC') {
      onChangeSorting(field, 'DESC')
    } else if (sorting?.sort === field && sorting?.dir === 'DESC') {
      onChangeSorting(undefined, undefined)
    } else {
      onChangeSorting(field, 'ASC')
    }
  }

  const renderValue = (row: TRow, column: DataTableColumn<TRow>): ReactNode => {
    if (column.formatter) {
      return column.formatter(row[column.key])
    }

    return <>{row[column.key]}</>
  }

  const renderSort = (column: DataTableColumn<TRow>): ReactNode => {
    if (!column.sortable) {
      return column.label
    }

    let arrow = <ArrowsUpDownIcon className="ml-2 h-4 w-4" />
    if (sorting?.sort === column.key) {
      if (sorting.dir === 'ASC') {
        arrow = <ArrowDownIcon className="ml-2 h-4 w-4" />
      }
      if (sorting.dir === 'DESC') {
        arrow = <ArrowUpIcon className="ml-2 h-4 w-4" />
      }
    }

    return (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8"
        onClick={() => changeSortHandler(column)}
      >
        <span className="text-sm">{column.label}</span>
        {arrow}
      </Button>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, i) => (
                <TableHead key={`${i}-${String(column.key)}`} {...column.headProps}>
                  {renderSort(column)}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, i) => (
              <TableRow key={keyId ? String(row[keyId]) : i}>
                {columns.map((column, k) => (
                  <TableCell key={`${k}-${String(column.key)}`} {...column.cellProps}>
                    {renderValue(row, column)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between flex-wrap mt-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {/* {table.getFilteredSelectedRowModel().rows.length} of{" "} */}
            {/* {table.getFilteredRowModel().rows.length} row(s) selected. */}
          </div>
          {pagination && <Pagination {...pagination} onChange={onChangePagination} />}
        </div>
      )}
    </>
  )
}
