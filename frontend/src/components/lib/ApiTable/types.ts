export interface ApiTableData<TRow> {
  rows: TRow[]
  total: number
}

export interface ApiTableFilter {
  [key: string]: string | string[] | undefined
}

export interface ApiTableProps<TRow> {
  url: string
  initialData?: ApiTableData<TRow>
}

export interface ApiTableContext<TRow> {
  data: ApiTableData<TRow>
  isLoading: boolean
  refetch: () => void
  error: Error | null
  limit: number
  page: number
  sort?: string
  dir?: string
  filter?: ApiTableFilter
  onChangePagination: (page: number, limit: number) => void
  onChangeSorting: (sort?: string, dir?: string) => void
  onChangeFilter: (values?: ApiTableFilter) => void
}
