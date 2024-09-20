'use client'

import { DataTable, DataTableColumn } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { ApiRemoveDialog } from '@/lib/ApiRemoveDialog'
import { BlogPostEntity, FindAllResult } from '@/types'
import { CheckCircleIcon, PencilIcon, TrashIcon, XCircleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { parseAsInteger, useQueryStates } from 'nuqs'
import useSWR from 'swr'

export interface BlogPostListProps {
  initialData?: FindAllResult<BlogPostEntity>
}

export function BlogPostList({ initialData }: BlogPostListProps) {
  const [{ page, limit }, setPagination] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      limit: parseAsInteger.withDefault(10)
    },
    {
      history: 'push',
      clearOnDefault: true
    }
  )

  const { data, isLoading, mutate } = useSWR<FindAllResult<BlogPostEntity>>(
    [
      `blog/post`,
      {
        page,
        limit
      }
    ],
    {
      fallbackData: initialData,
      keepPreviousData: true
    }
  )
  const refetch = () => mutate(data, { revalidate: true })

  const columns: DataTableColumn<BlogPostEntity>[] = [
    {
      key: 'title',
      label: 'Название',
      sortable: true,
      formatter: (title) => <div className="text-balance">{title}</div>
    },
    {
      key: 'active',
      label: 'Статус',
      headProps: {
        className: 'w-32'
      },
      formatter: (active) => {
        const color = active ? 'green' : 'amber'
        const Icon = active ? CheckCircleIcon : XCircleIcon
        return (
          <div className="flex gap-2 items-center">
            <Icon className={`w-6 h-6 text-${color}-500`} />
          </div>
        )
      }
    },
    {
      key: 'id',
      headProps: {
        className: 'w-0'
      },
      formatter: (id) => (
        <div className="flex gap-2">
          <Link href={`/dashboard/blog/${id}`}>
            <Button variant="outline" size="sm-icon">
              <PencilIcon className="w-4 h-4" />
            </Button>
          </Link>
          <ApiRemoveDialog url={`blog/post/${id}`} onSuccess={refetch}>
            <Button variant="destructive-outline" size="sm-icon">
              <TrashIcon className="w-4 h-4" />
            </Button>
          </ApiRemoveDialog>
        </div>
      )
    }
  ]

  const { rows, total } = data || { rows: [], total: 0 }

  // загрузить данные
  // передать данные в компонент таблицы
  return (
    <DataTable<BlogPostEntity>
      data={rows}
      isLoading={isLoading}
      columns={columns}
      // filter={{
      //   value: vespTable.filter,
      //   fields: filterFields
      // }}
      // onChangeFilter={vespTable.onChangeFilter}
      // sorting={{
      //   sort: vespTable.sort,
      //   dir: vespTable.dir
      // }}
      // onChangeSorting={vespTable.onChangeSorting}
      pagination={{ page, limit, total }}
      onChangePagination={(page, limit) => setPagination({ page, limit })}
    />
  )
}
