import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query'

export interface VespTableData<TRow> {
  rows: TRow[]
  total: number
}

export interface VespTableFilter {
  [key: string]: string | string[] | undefined
}

export interface VespTableProps<TRow> {
  url: string
  initialData?: VespTableData<TRow>
}

export interface VespTableContext<TRow> {
  data: VespTableData<TRow>
  isPending: boolean
  refetch: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<VespTableData<TRow>, Error>>
  error: Error | null
  limit: number
  page: number
  sort?: string
  dir?: string
  filter?: VespTableFilter
  onChangePagination: (page: number, limit: number) => void
  onChangeSorting: (sort?: string, dir?: string) => void
  onChangeFilter: (values?: VespTableFilter) => void
}
