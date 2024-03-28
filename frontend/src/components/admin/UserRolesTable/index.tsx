'use client'

import { DataTable, DataTableColumn } from '@/components/admin/DataTable'
import { Filter, FilterField } from '@/components/admin/Filter'
import { VespRemoveDialog } from '@/components/admin/VespRemoveDialog'
import { useVespTable } from '@/components/admin/VespTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { VespUserRole } from '@/types'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export function UserRolesTable() {
  const vespTable = useVespTable<VespUserRole>()

  const columns: DataTableColumn<VespUserRole>[] = [
    {
      key: 'id',
      label: 'ID',
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

  const filterFields: FilterField[] = [
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
    <div className="flex flex-col gap-4">
      <Filter fields={filterFields} value={vespTable.filter} onChange={vespTable.onChangeFilter} />
      <DataTable<VespUserRole>
        data={vespTable.data.rows}
        columns={columns}
        pagination={{
          page: vespTable.page,
          limit: vespTable.limit,
          total: vespTable.data.total
        }}
        sorting={{
          sort: vespTable.sort,
          dir: vespTable.dir
        }}
        onChangePagination={vespTable.onChangePagination}
        onChangeSorting={vespTable.onChangeSorting}
      />
    </div>
  )
}
