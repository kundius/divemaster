'use client'

import { useVespTable } from '@/components/admin/VespTable'
import { Badge } from '@/components/ui/badge'
import { VespUserRole } from '@/types'
import { DataTable, DataTableProps } from '../DataTable'
import { Button } from '@/components/ui/button'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export function UserRolesTable() {
  const vespTable = useVespTable<VespUserRole>()

  const changePaginationHandler = (page: number, limit: number) => {
    vespTable.changeParams({
      page,
      limit
    })
  }

  const changeSortHandler: DataTableProps<VespUserRole>['onChangeSort'] = (sort, dir) => {
    vespTable.changeParams({
      sort,
      dir
    })
  }

  return (
    <DataTable<VespUserRole>
      data={vespTable.data.rows}
      pagination={{
        page: vespTable.params.page,
        limit: vespTable.params.limit,
        total: vespTable.data.total
      }}
      onChangePagination={changePaginationHandler}
      sort={{
        by: vespTable.params.sort,
        dir: vespTable.params.dir
      }}
      onChangeSort={changeSortHandler}
      columns={[
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
              <Button variant="destructive-outline" size="sm-icon">
                <TrashIcon className="w-4 h-4" />
              </Button>
            </div>
          )
        }
      ]}
    />
  )
}
