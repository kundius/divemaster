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
import { cn } from '@/lib/utils'
import {
  ArrowsUpDownIcon,
  BarsArrowDownIcon,
  BarsArrowUpIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { ReactNode } from 'react'

import { Pagination, PaginationProps } from './Pagination'
import { SearchFilter, SearchFilterProps } from './SearchFilter'
import { FacetedFilter, FacetedFilterProps } from './FacetedFilter'

export interface SearchFilterField extends Omit<SearchFilterProps, 'onChange' | 'value'> {
  type: 'search'
  name: string
}

export interface FacetedFilterField extends Omit<FacetedFilterProps, 'onChange' | 'value'> {
  type: 'faceted'
  name: string
}

export type DataTableFilterField = SearchFilterField | FacetedFilterField

export type DataTableColumn<T> = {
  [K in keyof T]: {
    label?: string
    headProps?: React.ThHTMLAttributes<HTMLTableCellElement>
    cellProps?: React.TdHTMLAttributes<HTMLTableCellElement>
    key: K
    sortable?: boolean
    formatter?: (value: T[K], row: T) => ReactNode
  }
}[keyof T]

export type DataTableFilter = Record<string, string | string[] | null>

export interface DataTablePagination {
  page: number
  limit: number
}

export interface DataTableSorting {
  sort: string | null
  dir: string | null
}

export interface DataTableProps<TRow, TFilter> {
  isLoading?: boolean
  columns?: DataTableColumn<TRow>[]
  data?: TRow[]
  total?: number
  keyId?: keyof TRow
  filters?: DataTableFilterField[]
  filter?: TFilter
  setFilter?: (value: TFilter) => void
  pagination?: DataTablePagination
  setPagination?: (pagination: DataTablePagination) => void
  sorting?: DataTableSorting
  setSorting?: (sorting: DataTableSorting) => void
}

export function DataTable<
  TRow extends unknown = unknown,
  TFilter extends DataTableFilter = DataTableFilter
>(props: DataTableProps<TRow, TFilter>) {
  const {
    keyId,
    isLoading,
    data = [],
    total = 0,
    columns = [],
    filters = [],
    filter = {} as TFilter,
    setFilter: onChangeFilter,
    pagination,
    setPagination: onChangePagination,
    sorting,
    setSorting: onChangeSorting
  } = props

  const changeSortHandler = (column: DataTableColumn<TRow>) => {
    if (!onChangeSorting) return

    const field = String(column.key)

    if (sorting?.sort === field && sorting?.dir === 'asc') {
      onChangeSorting({ sort: field, dir: 'desc' })
    } else if (sorting?.sort === field && sorting?.dir === 'desc') {
      onChangeSorting({ sort: null, dir: null })
    } else {
      onChangeSorting({ sort: field, dir: 'asc' })
    }
  }

  const renderCell = (row: TRow, column: DataTableColumn<TRow>): ReactNode => {
    if (column.formatter) {
      return column.formatter(row[column.key], row)
    }

    return String(row[column.key])
  }

  const renderHead = (column: DataTableColumn<TRow>): ReactNode => {
    if (!column.sortable) {
      return column.label
    }

    let arrow = <ArrowsUpDownIcon className="ml-2 h-4 w-4" />
    if (sorting?.sort === column.key) {
      if (sorting.dir === 'asc') {
        arrow = <BarsArrowDownIcon className="ml-2 h-4 w-4" />
      }
      if (sorting.dir === 'desc') {
        arrow = <BarsArrowUpIcon className="ml-2 h-4 w-4" />
      }
    }

    return (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2 px-2 h-8"
        onClick={() => changeSortHandler(column)}
      >
        <span className="text-sm">{column.label}</span>
        {arrow}
      </Button>
    )
  }

  const renderFilter = (item: DataTableFilterField) => {
    let value = filter[item.name]
    switch (item.type) {
      case 'faceted':
        if (typeof value === 'string') {
          value = [value]
        }
        return (
          <FacetedFilter
            options={item.options}
            title={item.title}
            value={value}
            onChange={(value) => onChangeFilter?.({ ...filter, [item.name]: value })}
          />
        )
      case 'search':
        if (Array.isArray(value)) {
          value = value.join(',')
        }
        return (
          <SearchFilter
            placeholder={item.placeholder}
            value={value}
            onChange={(value) => onChangeFilter?.({ ...filter, [item.name]: value })}
          />
        )
    }
  }

  const resetFilter = () => {
    let newValue: TFilter = { ...filter }
    for (const key of Object.keys(filter)) {
      newValue = { ...newValue, [key]: null }
    }
    onChangeFilter?.(newValue)
  }

  const isFiltered = () => {
    return Object.values(filter).filter((v) => !!v).length > 0
  }

  return (
    <div className="space-y-4">
      {filters.length > 0 && (
        <div className="flex items-center flex-wrap gap-2">
          {filters.map((item) => (
            <div key={item.name}>{renderFilter(item)}</div>
          ))}
          {isFiltered() && (
            <Button variant="ghost" className="h-8 px-3" onClick={resetFilter}>
              Сбросить <XMarkIcon className="ml-1 -mr-1 h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, i) => (
                <TableHead key={`${i}-${String(column.key)}`} {...column.headProps}>
                  {renderHead(column)}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, i) => (
              <TableRow key={keyId ? String(row[keyId]) : i}>
                {columns.map((column, k) => (
                  <TableCell key={`${k}-${String(column.key)}`} {...column.cellProps}>
                    {renderCell(row, column)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between flex-wrap">
          <div />
          {pagination && (
            <Pagination
              {...pagination}
              total={total}
              onChange={(page, limit) => onChangePagination?.({ page, limit })}
            />
          )}
        </div>
      )}
    </div>
  )
}
