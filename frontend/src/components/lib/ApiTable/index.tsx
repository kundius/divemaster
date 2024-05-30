'use client'

import { useSearchParams } from 'next/navigation'
import { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import { DEFAULT_LIMIT, DEFAULT_PAGE } from './constants'
import type { ApiTableContext, ApiTableData, ApiTableProps } from './types'

export function useApiTable<TRow extends unknown>({
  url,
  initialData,
  defaultLimit = DEFAULT_LIMIT
}: PropsWithChildren<ApiTableProps<TRow>>): ApiTableContext<TRow> {
  const searchParams = useSearchParams()

  const { filter, ...memoizedParams } = useMemo(() => {
    const output: Pick<ApiTableContext<TRow>, 'page' | 'limit' | 'sort' | 'dir' | 'filter'> = {
      limit: defaultLimit,
      page: DEFAULT_PAGE
    }

    if (searchParams.has('page')) {
      output.page = Number(searchParams.get('page'))
    }

    if (searchParams.has('limit')) {
      output.limit = Number(searchParams.get('limit'))
    }

    if (searchParams.has('sort')) {
      output.sort = String(searchParams.get('sort'))
    }

    if (searchParams.has('dir')) {
      output.dir = String(searchParams.get('dir'))
    }

    const entries = Array.from(searchParams.entries())
    entries.forEach(([key, value]) => {
      if (['limit', 'page', 'sort', 'dir'].includes(key)) return

      if (!output.filter) output.filter = {}

      const exist = output.filter[key]
      if (typeof exist === 'undefined') {
        output.filter[key] = value
      } else if (typeof exist === 'string') {
        output.filter[key] = [exist, value]
      } else {
        output.filter[key] = [...exist, value]
      }
    })

    return output
  }, [searchParams, defaultLimit])

  const onChangePagination = useCallback<ApiTableContext<TRow>['onChangePagination']>(
    (page, limit) => {
      const params = new URLSearchParams(searchParams.toString())

      if (page === 1) {
        params.delete('page')
      } else {
        params.set('page', String(page))
      }

      if (limit === defaultLimit) {
        params.delete('limit')
      } else {
        params.set('limit', String(limit))
      }

      window.history.pushState(null, '', `?${params.toString()}`)
    },
    [searchParams, defaultLimit]
  )

  const onChangeSorting = useCallback<ApiTableContext<TRow>['onChangeSorting']>(
    (sort, dir) => {
      const params = new URLSearchParams(searchParams.toString())

      if (typeof sort === 'undefined') {
        params.delete('sort')
      } else {
        params.set('sort', String(sort))
      }

      if (typeof dir === 'undefined') {
        params.delete('dir')
      } else {
        params.set('dir', String(dir))
      }

      window.history.pushState(null, '', `?${params.toString()}`)
    },
    [searchParams]
  )

  const onChangeFilter = useCallback<ApiTableContext<TRow>['onChangeFilter']>(
    (values) => {
      const params = new URLSearchParams(searchParams.toString())

      if (filter) {
        for (const fieldName of Object.keys(filter)) {
          params.delete(fieldName)
        }
      }

      if (memoizedParams.page !== 1) {
        params.delete('page')
      }

      if (values) {
        for (const fieldName of Object.keys(values)) {
          let value = values[fieldName as keyof typeof values]
          if (typeof value === 'undefined') {
            params.delete(fieldName)
          } else if (Array.isArray(value)) {
            params.delete(fieldName)
            for (const v of value) {
              params.append(fieldName, v)
            }
          } else {
            params.set(fieldName, value)
          }
        }
      }

      window.history.pushState(null, '', `?${params.toString()}`)
    },
    [filter, memoizedParams.page, searchParams]
  )

  const swrQuery = useSWR<ApiTableData<TRow>>([url, { ...memoizedParams, ...filter }])
  const refetch = () => swrQuery.mutate(swrQuery.data, { revalidate: true })

  // Сохраняем последние загруженные данные, чтобы при загруке показывать предыдущее состояние
  const [previousData, setPreviousData] = useState<ApiTableData<TRow> | undefined>(undefined)
  useEffect(() => {
    if (!swrQuery.isLoading) {
      setPreviousData(swrQuery.data)
    }
  }, [swrQuery.data, swrQuery.isLoading])

  // показываем данные исходя из стратегии ниже
  const emptyData: ApiTableData<TRow> = {
    rows: [],
    total: 0
  }
  const getData = () => {
    if (swrQuery.isLoading) {
      return previousData || initialData || emptyData
    }
    return swrQuery.data || emptyData
  }

  return {
    ...memoizedParams,
    data: getData(),
    refetch,
    isLoading: swrQuery.isLoading,
    error: swrQuery.error,
    filter,
    onChangeFilter,
    onChangePagination,
    onChangeSorting
  }
}
