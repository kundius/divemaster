'use client'

import { DataTable, DataTableColumn } from '@/components/admin/DataTable'
import type { FilterField } from '@/components/admin/Filter'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { VespRemoveDialog } from '@/components/vesp/VespRemoveDialog'
import { useVespTable } from '@/components/vesp/VespTable'
import { VespUser } from '@/types'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export function UsersTable() {
  const vespTable = useVespTable<VespUser>()

  const columns: DataTableColumn<VespUser>[] = [
    {
      key: 'id',
      label: 'ID'
    },
    {
      key: 'username',
      label: 'Логин'
    },
    {
      key: 'email',
      label: 'E-mail'
    },
    {
      key: 'fullname',
      label: 'Имя'
    },
    {
      key: 'role',
      label: 'Роль',
      formatter: (role) => <Badge variant="outline">{role?.title}</Badge>
    },
    {
      key: 'id',
      headProps: {
        className: 'w-0'
      },
      formatter: (id) => (
        <div className="flex gap-2">
          <Link href={`/admin/users/${id}`}>
            <Button variant="outline" size="sm-icon">
              <PencilIcon className="w-4 h-4" />
            </Button>
          </Link>
          <VespRemoveDialog url={`admin/users/${id}`} onSuccess={vespTable.refetch}>
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
      placeholder: 'Поиск по имени'
    }
  ]

  return (
    <DataTable<VespUser>
      data={vespTable.data.rows}
      columns={columns}
      filter={{
        value: vespTable.filter,
        fields: filterFields
      }}
      onChangeFilter={vespTable.onChangeFilter}
      pagination={{
        page: vespTable.page,
        limit: vespTable.limit,
        total: vespTable.data.total
      }}
      onChangePagination={vespTable.onChangePagination}
      sorting={{
        sort: vespTable.sort,
        dir: vespTable.dir
      }}
      onChangeSorting={vespTable.onChangeSorting}
    />
  )
}