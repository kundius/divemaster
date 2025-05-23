'use client'

import { DataTableProps } from '@/components/DataTable'
import { clearEmpty } from '@/lib/utils'
import { FindAllResult, SyncTaskEntity } from '@/types'
import { parseAsInteger, parseAsString, ParserBuilder, useQueryStates, Values } from 'nuqs'
import { createContext, PropsWithChildren, useContext } from 'react'
import useSWR from 'swr'

export type TasksFilterType = Values<{
  query: ParserBuilder<string>
  tags: ParserBuilder<string[]>
}>

export interface TasksContextType
  extends Pick<
    DataTableProps<SyncTaskEntity, TasksFilterType>,
    'pagination' | 'setPagination' | 'sorting' | 'setSorting'
  > {
  isLoading: boolean
  data: FindAllResult<SyncTaskEntity> | undefined
  refetch: () => Promise<FindAllResult<SyncTaskEntity> | undefined>
}

export const TasksContext = createContext<TasksContextType | undefined>(undefined)

export interface TasksProviderProps {
  fallbackData?: FindAllResult<SyncTaskEntity>
}

export function TasksProvider({ children, fallbackData }: PropsWithChildren<TasksProviderProps>) {
  const [pagination, setPagination] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      limit: parseAsInteger.withDefault(10)
    },
    {
      clearOnDefault: true
    }
  )

  const [sorting, setSorting] = useQueryStates({
    sort: parseAsString,
    dir: parseAsString
  })

  const { data, isLoading, mutate } = useSWR<FindAllResult<SyncTaskEntity>>(
    [
      `sync/task`,
      {
        ...pagination,
        ...clearEmpty(sorting),
        withBrand: true,
        withImages: true,
        withCategories: true
      }
    ],
    {
      fallbackData,
      keepPreviousData: true,
      refreshInterval: 5
    }
  )

  const refetch = () => mutate(data, { revalidate: true })

  return (
    <TasksContext.Provider
      value={{
        pagination,
        setPagination,
        sorting,
        setSorting,
        isLoading,
        data,
        refetch
      }}
    >
      {children}
    </TasksContext.Provider>
  )
}

export function useTasks() {
  const context = useContext(TasksContext)

  if (!context) {
    throw new Error('useTasks must be used within a TasksProvider')
  }

  return context
}
