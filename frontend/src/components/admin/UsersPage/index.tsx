'use client'

import { DataTable, DataTableColumn } from '@/components/DataTable'
import type { FilterField } from '@/components/admin/Filter'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ApiRemoveDialog } from '@/lib/ApiRemoveDialog'
import { useApiTable } from '@/lib/ApiTable'
import { ApiTableData } from '@/lib/ApiTable/types'
import { UserEntity } from '@/types'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { PageHeader, PageHeaderProps } from '../PageHeader'

export interface UsersPageProps {
  initialData?: ApiTableData<UserEntity>
}

export function UsersPage({ initialData }: UsersPageProps) {
  const vespTable = useApiTable<UserEntity>({
    url: 'users',
    initialData
  })

  const columns: DataTableColumn<UserEntity>[] = [
    {
      key: 'id',
      label: 'ID'
    },
    {
      key: 'name',
      label: 'Имя'
    },
    {
      key: 'email',
      label: 'E-mail'
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
          <ApiRemoveDialog url={`users/${id}`} onSuccess={vespTable.refetch}>
            <Button variant="destructive-outline" size="sm-icon">
              <TrashIcon className="w-4 h-4" />
            </Button>
          </ApiRemoveDialog>
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

  const actions: PageHeaderProps['actions'] = [
    <Link href="/admin/users/create" key="create">
      <Button>Добавить пользователя</Button>
    </Link>
  ]

  return (
    <>
      <PageHeader title="Пользователи" actions={actions} />
      <DataTable<UserEntity>
        data={vespTable.data.rows}
        isLoading={vespTable.isLoading}
        columns={columns}
        filter={{
          value: vespTable.filter,
          fields: filterFields
        }}
        setFilter={vespTable.onChangeFilter}
        pagination={{
          page: vespTable.page,
          limit: vespTable.limit,
          total: vespTable.data.total
        }}
        setPagination={vespTable.onChangePagination}
        sorting={{
          sort: vespTable.sort,
          dir: vespTable.dir
        }}
        setSorting={vespTable.onChangeSorting}
      />
    </>
  )
}
