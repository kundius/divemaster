import { ReactNode } from 'react'

export interface DataTableSearchFilter {
  type: 'search'
  name: string
  placeholder?: string
}

export interface DataTableFacetedFilter {
  type: 'faceted'
  name: string
  title: string
  options: {
    value: string
    label: string
  }[]
}

export type DataTableFilter = DataTableSearchFilter | DataTableFacetedFilter

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
  filters?: DataTableFilter[]
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
  filter?: FilterValue
  onChangeFilter?: (value: FilterValue) => void
}

export interface PaginationProps {
  limit: number
  page: number
  total: number
  onChange?: (page: number, limit: number) => void
}

export type FilterValue = {
  [key: string]: string | string[] | undefined
}

export interface FilterProps {
  filters?: DataTableFilter[]
  value?: FilterValue
  onChange?: (value: FilterValue) => void
}
