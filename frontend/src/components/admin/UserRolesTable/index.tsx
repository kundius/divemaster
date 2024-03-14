'use client'

import { DataTable } from '@/components/admin/DataTable'
import type { DataTableColumn, DataTableFilter } from '@/components/admin/DataTable/types'
import { useVespTable } from '@/components/admin/VespTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { VespUserRole } from '@/types'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { VespRemoveDialog } from '../VespRemoveDialog'

export function UserRolesTable() {
  const vespTable = useVespTable<VespUserRole>()

  const columns: DataTableColumn<VespUserRole>[] = [
    {
      key: 'id',
      label: 'ID',
      headProps: {
        className: 'w-2/12'
      }
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
      key: 'scope',
      label: 'Разрешения',
      headProps: {
        className: 'w-5/12'
      },
      formatter: (scope) => (
        <div className="flex flex-wrap gap-1.5">
          {scope.map((value) => (
            <Badge key={value} variant="outline">
              {value}
            </Badge>
          ))}
        </div>
      )
    },
    {
      key: 'id',
      formatter: (id) => (
        <div className="flex gap-2">
          <Link href={`/admin/user-roles/${id}`}>
            <Button variant="outline" size="sm-icon">
              <PencilIcon className="w-4 h-4" />
            </Button>
          </Link>
          <VespRemoveDialog url={`admin/user-roles/${id}`} onSuccess={vespTable.refetch}>
            <Button variant="destructive-outline" size="sm-icon">
              <TrashIcon className="w-4 h-4" />
            </Button>
          </VespRemoveDialog>
        </div>
      )
    }
  ]

  const filters: DataTableFilter[] = [
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

  return (
    <DataTable<VespUserRole>
      data={vespTable.data.rows}
      columns={columns}
      filters={filters}
      pagination={{
        page: vespTable.page,
        limit: vespTable.limit,
        total: vespTable.data.total
      }}
      sorting={{
        sort: vespTable.sort,
        dir: vespTable.dir
      }}
      filter={vespTable.filter}
      onChangePagination={vespTable.onChangePagination}
      onChangeSorting={vespTable.onChangeSorting}
      onChangeFilter={vespTable.onChangeFilter}
    />
  )
}
