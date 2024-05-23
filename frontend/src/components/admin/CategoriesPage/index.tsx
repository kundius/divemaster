'use client'

import { DataTable, DataTableColumn } from '@/components/admin/DataTable'
import type { FilterField } from '@/components/admin/Filter'
import { Button } from '@/components/ui/button'
import { VespRemoveDialog } from '@/components/vesp/VespRemoveDialog'
import { useVespTable } from '@/components/vesp/VespTable'
import { VespTableData } from '@/components/vesp/VespTable/types'
import { VespCategory } from '@/types'
import { CheckCircleIcon, PencilIcon, TrashIcon, XCircleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { PageHeader, PageHeaderProps } from '../PageHeader'

export interface CategoriesPageProps {
  initialData?: VespTableData<VespCategory>
}

export function CategoriesPage({ initialData }: CategoriesPageProps) {
  const vespTable = useVespTable<VespCategory>({
    url: 'categories',
    initialData
  })

  const columns: DataTableColumn<VespCategory>[] = [
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
      key: 'active',
      label: 'Активна',
      headProps: {
        className: 'w-5/12'
      },
      formatter: (active) => {
        const Icon = active ? CheckCircleIcon : XCircleIcon
        const color = active ? 'text-green-500' : 'text-amber-500'
        return <Icon className={`w-6 h-6 ${color}`} />
      }
    },
    {
      key: 'id',
      headProps: {
        className: 'w-0'
      },
      formatter: (id) => (
        <div className="flex gap-2">
          <Link href={`/admin/categories/${id}`}>
            <Button variant="outline" size="sm-icon">
              <PencilIcon className="w-4 h-4" />
            </Button>
          </Link>
          <VespRemoveDialog url={`categories/${id}`} onSuccess={vespTable.refetch}>
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
    }
  ]

  const actions: PageHeaderProps['actions'] = [
    <Link href="/admin/categories/create" key="create">
      <Button>Добавить категорию</Button>
    </Link>
  ]

  return (
    <>
      <PageHeader title="Категории" actions={actions} />
      <DataTable<VespCategory>
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
