'use client'

import { DataTable, DataTableColumn } from '@/components/admin/DataTable'
import type { FilterField } from '@/components/admin/Filter'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { VespRemoveDialog } from '@/components/vesp/VespRemoveDialog'
import { useVespTable } from '@/components/vesp/VespTable'
import { getImageLink } from '@/lib/utils'
import { VespProduct } from '@/types'
import { CheckCircleIcon, PencilIcon, TrashIcon, XCircleIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'

export function ProductsTable() {
  const thumbWidth = 40
  const thumbHeight = 40

  const vespTable = useVespTable<VespProduct>()

  const columns: DataTableColumn<VespProduct>[] = [
    {
      key: 'id',
      label: 'Товар',
      sortable: true,
      headProps: {
        className: 'w-5/12'
      },
      formatter: (_, row) => {
        return (
          <div className="flex items-center gap-2">
            {row.file && (
              <Image
                className="rounded"
                src={getImageLink(row.file, { fit: 'crop', w: thumbWidth, h: thumbHeight })}
                width={thumbWidth}
                height={thumbHeight}
                alt=""
              />
            )}
            <div className="">{row.title}</div>
          </div>
        )
      }
    },
    {
      key: 'category',
      label: 'Категория',
      headProps: {
        className: 'w-5/12'
      },
      formatter: (category) => {
        return (
          <Link href={`/admin/categories/${category.id}`}>
            <Badge variant="outline">{category.title}</Badge>
          </Link>
        )
      }
    },
    {
      key: 'price',
      label: 'Цена',
      sortable: true,
      headProps: {
        className: 'w-5/12'
      }
    },
    {
      key: 'active',
      label: 'Активен',
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
          <Link href={`/admin/products/${id}`}>
            <Button variant="outline" size="sm-icon">
              <PencilIcon className="w-4 h-4" />
            </Button>
          </Link>
          <VespRemoveDialog url={`admin/products/${id}`} onSuccess={vespTable.refetch}>
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

  return (
    <DataTable<VespProduct>
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
  )
}