import { ReactNode } from 'react'

export interface TablePageProps<TRow> {
  action: (values?: TablePageParams) => Promise<TablePageData<TRow>>
  initialData?: TablePageData<TRow>
  idKey: keyof TRow
  columns: TableColumn<TRow>[]
  title: string
  sectionPath: string
}

export interface TablePageData<TRow> {
  rows: TRow[]
  total: number
}

export interface TablePageParams {
  limit: number
  page: number
}

type TableColumn<T> = {
  [K in keyof T]: {
    label: string
    key: K
    sortable?: boolean
    // format: 'tags' | 'default'
    formatter?: (value: T[K]) => ReactNode
  }
}[keyof T]

// export interface TablePageColumn<TRow extends object> {
//   key: keyof TRow
//   label: string
//   sortable?: boolean
//   formatter?: (value: TRow[key]) => ReactNode
// }
