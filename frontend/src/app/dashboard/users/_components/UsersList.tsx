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
import { FindAllResult, UserEntity, UserRoleEntity } from '@/types'

export interface UsersListProps {
  fallbackData?: FindAllResult<UserEntity>
}

export function UsersList({ fallbackData }: UsersListProps) {
  const rolesQuery = useSWR<FindAllResult<UserRoleEntity>>([`roles`, { limit: 100 }])

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
    roles: parseAsArrayOf(parseAsString)
  })

  const { data, isLoading, mutate } = useSWR<FindAllResult<UserEntity>>(
    [
      `users`,
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

  const columns: DataTableColumn<UserEntity>[] = [
    {
      dataIndex: 'name',
      label: 'Имя',
      sortable: true
    },
    {
      dataIndex: 'email',
      label: 'E-mail'
    },
    {
      dataIndex: 'role',
      label: 'Роль',
      formatter: (role) => <Badge variant="outline">{role?.title}</Badge>
    },
    {
      dataIndex: 'id',
      headProps: {
        className: 'w-0'
      },
      formatter: (id) => (
        <div className="flex gap-2">
          <Link href={`/dashboard/users/${id}`}>
            <Button variant="outline" size="icon">
              <PencilIcon className="w-4 h-4" />
            </Button>
          </Link>
          <ApiRemoveDialog url={`users/${id}`} onSuccess={refetch}>
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
      placeholder: 'Поиск по имени или e-mail'
    },
    {
      name: 'roles',
      type: 'faceted',
      options: (rolesQuery.data?.rows || []).map((item) => ({
        label: item.title,
        value: item.title
      })),
      title: 'Роли'
    }
  ]

  const { rows, total } = data || { rows: [], total: 0 }

  return (
    <DataTable<UserEntity, typeof filter>
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
