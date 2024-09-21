'use client'

import { DataTable, DataTableColumn } from '@/components/DataTable'
import type { FilterField } from '@/components/admin/Filter'
import { Button } from '@/components/ui/button'
import { ApiRemoveDialog } from '@/lib/ApiRemoveDialog'
import { useApiTable } from '@/lib/ApiTable'
import { ApiTableData } from '@/lib/ApiTable/types'
import { OptionEntity } from '@/types'
import {
  CheckCircleIcon,
  PencilIcon,
  SquaresPlusIcon,
  TrashIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export interface OptionTableProps {
  initialData?: ApiTableData<OptionEntity>
}

export function OptionTable({ initialData }: OptionTableProps) {
  const apiTable = useApiTable<OptionEntity>({
    url: 'options',
    initialData
  })

  const columns: DataTableColumn<OptionEntity>[] = [
    {
      key: 'id',
      label: 'ID'
    },
    {
      key: 'key',
      label: 'Ключ',
      headProps: {
        className: 'w-5/12'
      }
    },
    {
      key: 'caption',
      label: 'Подпись',
      headProps: {
        className: 'w-5/12'
      }
    },
    {
      key: 'type',
      label: 'Тип',
      headProps: {
        className: 'w-5/12'
      }
    },
    {
      key: 'inFilter',
      label: 'Фильтр',
      headProps: {
        className: 'w-1/12'
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
          <Link href={`/dashboard/options/${id}`}>
            <Button variant="outline" size="sm-icon">
              <PencilIcon className="w-4 h-4" />
            </Button>
          </Link>
          <Link href={`/dashboard/options/${id}/categories`}>
            <Button variant="outline" size="sm-icon">
              <SquaresPlusIcon className="w-4 h-4" />
            </Button>
          </Link>
          <ApiRemoveDialog url={`options/${id}`} onSuccess={apiTable.refetch}>
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

  return (
    <DataTable<OptionEntity>
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
  )
}
