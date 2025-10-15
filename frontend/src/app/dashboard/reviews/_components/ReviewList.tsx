'use client'

import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryStates } from 'nuqs'
import useSWR from 'swr'
import { format } from 'date-fns'
import { CheckCircleIcon, XCircleIcon } from 'lucide-react'

import { DataTable, DataTableColumn, DataTableFilterField } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { ApiRemoveDialog } from '@/lib/ApiRemoveDialog'
import { clearEmpty } from '@/lib/utils'
import { ReviewEntity, FindAllResult } from '@/types'

export interface ReviewListProps {
  fallbackData?: FindAllResult<ReviewEntity>
}

export function ReviewList({ fallbackData }: ReviewListProps) {
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

  const { data, isLoading, mutate } = useSWR<FindAllResult<ReviewEntity>>(
    [
      `reviews`,
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

  const refetch = () => mutate(undefined, { revalidate: true })

  const columns: DataTableColumn<ReviewEntity>[] = [
    {
      key: 'author',
      label: 'Автор',
      formatter: (record) => (record.user ? record.user.name : record.author) || '-'
    },
    {
      dataIndex: 'publishedAt',
      label: 'Дата публикации',
      formatter: (value) => (value ? format(value, 'dd MMMM, yyyy') : '-'),
      sortable: true
    },
    {
      dataIndex: 'isPublished',
      label: 'Опубликован',
      formatter: (value) => {
        const Icon = value ? CheckCircleIcon : XCircleIcon
        const color = value ? 'text-green-500' : 'text-amber-500'
        return <Icon className={`w-6 h-6 ${color}`} />
      }
    },
    {
      dataIndex: 'isRecommended',
      label: 'Рекомендован',
      formatter: (value) => {
        const Icon = value ? CheckCircleIcon : XCircleIcon
        const color = value ? 'text-green-500' : 'text-amber-500'
        return <Icon className={`w-6 h-6 ${color}`} />
      }
    },
    {
      dataIndex: 'rating',
      label: 'Оценка',
      sortable: true
    },
    {
      key: 'actions',
      headProps: {
        className: 'w-0'
      },
      formatter: (record) => (
        <div className="flex gap-2">
          <Link href={`/dashboard/reviews/${record.id}`}>
            <Button variant="outline" size="icon">
              <PencilIcon className="w-4 h-4" />
            </Button>
          </Link>
          <ApiRemoveDialog url={`reviews/${record.id}`} onSuccess={refetch}>
            <Button
              variant="outline"
              className="text-destructive hover:text-destructive"
              size="icon"
            >
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
      placeholder: 'Поиск по тексту'
    }
  ]

  const { rows, total } = data || { rows: [], total: 0 }

  return (
    <DataTable<ReviewEntity, typeof filter>
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
