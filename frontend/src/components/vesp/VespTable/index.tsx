'use client'

import { apiGet } from '@/lib/api'
import { withToken } from '@/lib/api/with-token'
import { useAuth } from '@/lib/auth/use-auth'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { PropsWithChildren, useCallback, useMemo } from 'react'
import { DEFAULT_LIMIT } from './constants'
import type { VespTableContext, VespTableData, VespTableProps } from './types'

export function useVespTable<TRow extends unknown>({
  url,
  initialData
}: PropsWithChildren<VespTableProps<TRow>>): VespTableContext<TRow> {
  const auth = useAuth()
  const searchParams = useSearchParams()

  const { filter, ...memoizedParams } = useMemo(() => {
    const output: Pick<VespTableContext<TRow>, 'page' | 'limit' | 'sort' | 'dir' | 'filter'> = {
      limit: DEFAULT_LIMIT,
      page: 1
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
  }, [searchParams])

  const onChangePagination = useCallback<VespTableContext<TRow>['onChangePagination']>(
    (page, limit) => {
      const params = new URLSearchParams(searchParams.toString())

      if (page === 1) {
        params.delete('page')
      } else {
        params.set('page', String(page))
      }

      if (limit === DEFAULT_LIMIT) {
        params.delete('limit')
      } else {
        params.set('limit', String(limit))
      }

      window.history.pushState(null, '', `?${params.toString()}`)
    },
    [searchParams]
  )

  const onChangeSorting = useCallback<VespTableContext<TRow>['onChangeSorting']>(
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

  const onChangeFilter = useCallback<VespTableContext<TRow>['onChangeFilter']>(
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

  const { data, isPending, error, refetch } = useQuery<VespTableData<TRow>>({
    initialData,
    queryKey: [url, searchParams.toString()],
    queryFn: () =>
      apiGet<VespTableData<TRow>>(url, { ...memoizedParams, ...filter }, withToken(auth.token)())
  })

  return {
    ...memoizedParams,
    data: data || {
      rows: [],
      total: 0
    },
    refetch,
    isPending,
    error,
    filter,
    onChangeFilter,
    onChangePagination,
    onChangeSorting
  }
}
