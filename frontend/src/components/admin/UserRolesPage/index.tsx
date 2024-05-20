'use client'

import { DataTable, DataTableColumn } from '@/components/admin/DataTable'
import type { FilterField } from '@/components/admin/Filter'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { VespRemoveDialog } from '@/components/vesp/VespRemoveDialog'
import { useVespTable } from '@/components/vesp/VespTable'
import { VespTableData } from '@/components/vesp/VespTable/types'
import { VespUserRole } from '@/types'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { PageHeader, PageHeaderProps } from '../PageHeader'

export interface UserRolesPageProps {
  initialData?: VespTableData<VespUserRole>
}

export function UserRolesPage({ initialData }: UserRolesPageProps) {
  const vespTable = useVespTable<VespUserRole>({
    url: 'admin/user-roles',
    initialData
  })

  const columns: DataTableColumn<VespUserRole>[] = [
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

  const actions: PageHeaderProps['actions'] = [
    <Link href="/admin/user-roles/create" key="create">
      <Button>Добавить доступ</Button>
    </Link>
  ]

  return (
    <>
      <PageHeader title="Доступы" actions={actions} />
      <DataTable<VespUserRole>
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
        sorting={{
          sort: vespTable.sort,
          dir: vespTable.dir
        }}
        onChangePagination={vespTable.onChangePagination}
        onChangeSorting={vespTable.onChangeSorting}
      />
    </>
  )
}
