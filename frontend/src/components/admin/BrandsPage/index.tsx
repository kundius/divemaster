'use client'

import { DataTable, DataTableColumn } from '@/components/DataTable'
import type { FilterField } from '@/components/admin/Filter'
import { ApiRemoveDialog } from '@/lib/ApiRemoveDialog'
import { useApiTable } from '@/lib/ApiTable'
import { ApiTableData } from '@/lib/ApiTable/types'
import { Button } from '@/components/ui/button'
import { BrandEntity } from '@/types'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { PageHeader, PageHeaderProps } from '../PageHeader'

export interface BrandsPageProps {
  initialData?: ApiTableData<BrandEntity>
}

export function BrandsPage({ initialData }: BrandsPageProps) {
  const apiTable = useApiTable<BrandEntity>({
    url: 'brands',
    initialData
  })

  const columns: DataTableColumn<BrandEntity>[] = [
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
      key: 'id',
      headProps: {
        className: 'w-0'
      },
      formatter: (id) => (
        <div className="flex gap-2">
          <Link href={`/admin/brands/${id}`}>
            <Button variant="outline" size="sm-icon">
              <PencilIcon className="w-4 h-4" />
            </Button>
          </Link>
          <ApiRemoveDialog url={`brands/${id}`} onSuccess={apiTable.refetch}>
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
      placeholder: 'Поиск по названию'
    }
  ]

  const actions: PageHeaderProps['actions'] = [
    <Link href="/admin/brands/create" key="create">
      <Button>Добавить бренд</Button>
    </Link>
  ]

  return (
    <>
      <PageHeader title="Бренды" actions={actions} />
      <DataTable<BrandEntity>
        data={apiTable.data.rows}
        columns={columns}
        filter={{
          value: apiTable.filter,
          fields: filterFields
        }}
        setFilter={apiTable.onChangeFilter}
        pagination={{
          page: apiTable.page,
          limit: apiTable.limit,
          total: apiTable.data.total
        }}
        sorting={{
          sort: apiTable.sort,
          dir: apiTable.dir
        }}
        setPagination={apiTable.onChangePagination}
        setSorting={apiTable.onChangeSorting}
      />
    </>
  )
}
