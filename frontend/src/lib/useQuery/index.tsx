'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'

export interface UseQueryOptions<TResult> {
  initialData?: TResult
}

export function useQuery<TResult extends unknown>(
  url: string,
  params?: Record<string, any>,
  options?: UseQueryOptions<TResult>
) {
  const { initialData } = options || {}

  const swrQuery = useSWR<TResult>([url, params])
  const refetch = () => swrQuery.mutate(swrQuery.data, { revalidate: true })

  // Сохраняем последние загруженные данные, чтобы при загруке показывать предыдущее состояние
  const [previousData, setPreviousData] = useState<TResult | undefined>(undefined)
  useEffect(() => {
    if (!swrQuery.isLoading) {
      setPreviousData(swrQuery.data)
    }
  }, [swrQuery.data, swrQuery.isLoading])

  // показываем данные исходя из стратегии ниже
  const data = swrQuery.isLoading ? previousData || initialData : swrQuery.data

  return { data, refetch, loading: swrQuery.isLoading }
}
