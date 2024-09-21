'use client'

import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryStates } from 'nuqs'
import useSWR from 'swr'

import { DataTable, DataTableColumn, DataTableFilterField } from '@/components/DataTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ApiRemoveDialog } from '@/lib/ApiRemoveDialog'
import { clearEmpty } from '@/lib/utils'
import { FindAllResult, UserRoleEntity } from '@/types'

export interface UserRolesListProps {
  fallbackData?: FindAllResult<UserRoleEntity>
}

export function UserRolesList({ fallbackData }: UserRolesListProps) {
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
    scope: parseAsArrayOf(parseAsString)
  })

  const { data, isLoading, mutate } = useSWR<FindAllResult<UserRoleEntity>>(
    [
      `roles`,
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

  const columns: DataTableColumn<UserRoleEntity>[] = [
    {
      key: 'title',
      label: 'Название',
      sortable: true
    },
    {
      key: 'scope',
      label: 'Разрешения',
      formatter: (scope) => (
        <div className="flex flex-wrap gap-1.5">
          {scope?.map((value) => (
            <Badge key={value} variant="outline">
              {value}
            </Badge>
          ))}
        </div>
      )
    },
    {
      key: 'id',
      headProps: {
        className: 'w-0'
      },
      formatter: (id) => (
        <div className="flex gap-2">
          <Link href={`/dashboard/user-roles/${id}`}>
            <Button variant="outline" size="sm-icon">
              <PencilIcon className="w-4 h-4" />
            </Button>
          </Link>
          <ApiRemoveDialog url={`roles/${id}`} onSuccess={refetch}>
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
      type: 'search',
      name: 'query',
      placeholder: 'Поиск по названию'
    },
    {
      type: 'faceted',
      name: 'scope',
      title: 'Разрешения',
      options: [
        {
          label: 'профиль',
          value: 'profile'
        },
        {
          label: 'Доступ',
          value: 'roles'
        },
        {
          label: 'Пользователи',
          value: 'users'
        },
        {
          label: 'Товары',
          value: 'products'
        },
        {
          label: 'Админ',
          value: 'admin'
        }
      ]
    }
  ]

  const { rows, total } = data || { rows: [], total: 0 }

  return (
    <DataTable<UserRoleEntity, typeof filter>
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
