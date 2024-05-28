'use client'

import { DataTable, DataTableColumn } from '@/components/admin/DataTable'
import type { FilterField } from '@/components/admin/Filter'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ApiRemoveDialog } from '@/components/lib/ApiRemoveDialog'
import { useApiTable } from '@/components/lib/ApiTable'
import { ApiTableData } from '@/components/lib/ApiTable/types'
import { ProductEntity } from '@/types'
import { CheckCircleIcon, PencilIcon, TrashIcon, XCircleIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import { PageHeader, PageHeaderProps } from '../PageHeader'

export interface ProductsPageProps {
  initialData?: ApiTableData<ProductEntity>
}

export function ProductsPage({ initialData }: ProductsPageProps) {
  const thumbWidth = 40
  const thumbHeight = 40

  const vespTable = useApiTable<ProductEntity>({
    url: 'products',
    initialData
  })

  const columns: DataTableColumn<ProductEntity>[] = [
    {
      key: 'title',
      label: 'Товар',
      sortable: true,
      headProps: {
        className: 'w-5/12'
      },
      formatter: (title, row) => {
        return (
          <div className="flex items-center gap-2">
            {/* {row.file && (
              <Image
                className="rounded"
                src={getImageLink(row.file, { fit: 'crop', w: thumbWidth, h: thumbHeight })}
                width={thumbWidth}
                height={thumbHeight}
                alt=""
              />
            )} */}
            <div className="">{title}</div>
          </div>
        )
      }
    },
    // {
    //   key: 'category',
    //   label: 'Категория',
    //   headProps: {
    //     className: 'w-5/12'
    //   },
    //   formatter: (category) => {
    //     return (
    //       <Link href={`/admin/categories/${category.id}`}>
    //         <Badge variant="outline">{category.title}</Badge>
    //       </Link>
    //     )
    //   }
    // },
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
          <ApiRemoveDialog url={`admin/products/${id}`} onSuccess={vespTable.refetch}>
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
    <Link href="/admin/products/create" key="create">
      <Button>Добавить товар</Button>
    </Link>
  ]

  return (
    <>
      <PageHeader title="Товары" actions={actions} />
      <DataTable<ProductEntity>
        data={vespTable.data.rows}
        isLoading={vespTable.isLoading}
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
