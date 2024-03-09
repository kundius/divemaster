'use client'

import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { PropsWithChildren, createContext, useCallback, useContext, useMemo } from 'react'
import { parseParams, pushParams } from './utils'

export interface VespTableData<TRow> {
  rows: TRow[]
  total: number
}

export interface VespTableParams {
  limit: number
  page: number
  filter?: {
    [key: string]: string
  }
  sort?: string
  dir?: string
}

interface VespTableProps<TRow> {
  action: (values?: VespTableParams) => Promise<VespTableData<TRow>>
  initialData?: VespTableData<TRow>
}

interface VespTableContext<TRow> {
  data: VespTableData<TRow>
  params: VespTableParams
  changeParams: (values: Partial<VespTableParams>) => void
}

const VespTableContext = createContext<VespTableContext<unknown>>(null!)

export function VespTable<TRow = unknown>({
  children,
  action,
  initialData
}: PropsWithChildren<VespTableProps<TRow>>) {
  const searchParams = useSearchParams()

  const params = useMemo<VespTableParams>(() => parseParams(searchParams), [searchParams])

  const changeParams = useCallback(
    (values: Partial<VespTableParams>) => pushParams(searchParams, values),
    [searchParams]
  )

  const { data, isPending, error } = useQuery<VespTableData<TRow>>({
    initialData,
    // placeholderData: (data) => data,
    queryKey: Object.entries(params).map((e) => e.join(':')),
    queryFn: () => action(params)
  })

  // if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  return (
    <VespTableContext.Provider
      value={{
        data: data || {
          rows: [],
          total: 0
        },
        params,
        changeParams
      }}
    >
      {children}
    </VespTableContext.Provider>
  )
}

export function useVespTable<TRow extends unknown>() {
  const context = useContext<VespTableContext<TRow>>(
    VespTableContext as unknown as React.Context<VespTableContext<TRow>>
  )
  if (!context) {
    throw new Error('useVespTable must be used under VespTable')
  }
  return context
}
