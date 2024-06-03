'use client'

import { ApiTableData } from '@/components/lib/ApiTable/types'
import {
  PropsWithChildren,
  useState,
  createContext,
  SetStateAction,
  Dispatch,
  useContext,
  useEffect,
  useRef,
  MutableRefObject
} from 'react'
import useSWR from 'swr'

const DEFAULT_PARAMS = {
  page: 1,
  limit: 10
}

export interface ResorcesParams {
  page: number
  limit: number

  [key: string]: string | string[] | number | boolean
}

interface ResorcesContextValue<TRow> {
  rows: TRow[]
  total: number
  refetch: () => void
  loading: boolean
  params: ResorcesParams
  defaultParams: ResorcesParams
  setParams: Dispatch<SetStateAction<ResorcesParams>>
  listRef: MutableRefObject<HTMLDivElement | null>
}

const ResorcesContext = createContext<ResorcesContextValue<unknown>>(null!)

export interface ResorcesProps<TRow> {
  url: string
  defaultParams?: Partial<ResorcesParams>
  initialData?: ApiTableData<TRow>
}

export function Resorces<TRow extends unknown>({
  children,
  url,
  defaultParams,
  initialData
}: PropsWithChildren<ResorcesProps<TRow>>) {
  const [params, setParams] = useState<ResorcesParams>({ ...DEFAULT_PARAMS, ...defaultParams })
  const listRef = useRef<HTMLDivElement | null>(null)

  // const setListRef = (value: any) => {
  //   listRef.current = value
  // }
  // const getListRef = (value: any) => {
  //   return listRef.current
  // }

  const swrQuery = useSWR<ApiTableData<TRow>>([url, params])
  const refetch = () => swrQuery.mutate(swrQuery.data, { revalidate: true })

  // Сохраняем последние загруженные данные, чтобы при загруке показывать предыдущее состояние
  const [previousData, setPreviousData] = useState<ApiTableData<TRow> | undefined>(undefined)
  useEffect(() => {
    if (!swrQuery.isLoading) {
      setPreviousData(swrQuery.data)
    }
  }, [swrQuery.data, swrQuery.isLoading])

  // показываем данные исходя из стратегии ниже
  const rows = swrQuery.isLoading
    ? previousData?.rows || initialData?.rows || []
    : swrQuery.data?.rows || []
  const total = swrQuery.isLoading
    ? previousData?.total || initialData?.total || 0
    : swrQuery.data?.total || 0

  return (
    <ResorcesContext.Provider
      value={{
        rows,
        total,
        refetch,
        loading: swrQuery.isLoading,
        defaultParams: { ...DEFAULT_PARAMS, ...defaultParams },
        params,
        setParams,
        listRef
      }}
    >
      {children}
    </ResorcesContext.Provider>
  )
}

export function useResorces<TRow extends unknown>() {
  return useContext(ResorcesContext) as unknown as ResorcesContextValue<TRow>
}
