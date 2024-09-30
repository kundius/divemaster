'use client'

import { CheckCircleIcon, PencilIcon, TrashIcon, XCircleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryStates } from 'nuqs'
import useSWR from 'swr'

import { DataTable, DataTableColumn, DataTableFilterField } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { ApiRemoveDialog } from '@/lib/ApiRemoveDialog'
import { clearEmpty, getFileUrl } from '@/lib/utils'
import { CategoryEntity, FindAllResult } from '@/types'

export interface CategoryListProps {
  fallbackData?: FindAllResult<CategoryEntity>
}

export function CategoryList({ fallbackData }: CategoryListProps) {
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

  const [filter, setFilter] = useQueryStates({
    query: parseAsString,
    tags: parseAsArrayOf(parseAsString)
  })

  const { data, isLoading, mutate } = useSWR<FindAllResult<CategoryEntity>>(
    [
      `categories`,
      {
        ...pagination,
        ...clearEmpty(sorting),
        ...clearEmpty(filter)
      }
    ],
    {
      fallbackData,
      keepPreviousData: true
    }
  )

  const refetch = () => mutate(data, { revalidate: true })

  const columns: DataTableColumn<CategoryEntity>[] = [
    {
      key: 'id',
      label: 'ID'
    },
    {
      key: 'title',
      label: 'Название',
      sortable: true,
      headProps: {
        className: 'w-5/12'
      }
    },
    {
      key: 'active',
      label: 'Активна',
      headProps: {
        className: 'w-5/12'
      },
      formatter: (active) => {
        const Icon = active ? CheckCircleIcon : XCircleIcon
        const color = active ? 'text-green-500' : 'text-amber-500'
        return <Icon className={`w-6 h-6 ${color}`} />
      }
    },
    {
      key: 'id',
      headProps: {
        className: 'w-0'
      },
      formatter: (id) => (
        <div className="flex gap-2">
          <Link href={`/dashboard/categories/${id}`}>
            <Button variant="outline" size="sm-icon">
              <PencilIcon className="w-4 h-4" />
            </Button>
          </Link>
          <ApiRemoveDialog url={`categories/${id}`} onSuccess={refetch}>
            <Button variant="destructive-outline" size="sm-icon">
              <TrashIcon className="w-4 h-4" />
            </Button>
          </ApiRemoveDialog>
        </div>
      )
    }
  ]

  const filters: DataTableFilterField[] = [
    {
      name: 'query',
      type: 'search',
      placeholder: 'Поиск по названию'
    }
  ]

  const { rows, total } = data || { rows: [], total: 0 }

  return (
    <DataTable<CategoryEntity, typeof filter>
      data={rows}
      total={total}
      isLoading={isLoading}
      columns={columns}
      filters={filters}
      filter={filter}
      setFilter={setFilter}
      sorting={sorting}
      setSorting={setSorting}
      pagination={pagination}
      setPagination={setPagination}
    />
  )
}
