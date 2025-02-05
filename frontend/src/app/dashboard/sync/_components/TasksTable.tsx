'use client'

import { DataTable, DataTableColumn, DataTableFilterField } from '@/components/DataTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ApiRemoveDialog } from '@/lib/ApiRemoveDialog'
import { getFileUrl } from '@/lib/utils'
import { ProductEntity } from '@/types'
import { CheckCircleIcon, PencilIcon, TrashIcon, XCircleIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import { TasksFilterType, useTasks } from './TasksProvider'

export function TasksTable() {
  const { data = { rows: [], total: 0 }, refetch, ...tasks } = useTasks()

  const columns: DataTableColumn<ProductEntity>[] = [
    {
      key: 'title',
      label: 'Товар',
      sortable: true,
      formatter: (title, record) => {
        let image: null | string = null
        if (record.images && record.images[0]) {
          image = getFileUrl(record.images[0].fileId)
        }
        return (
          <div className="flex gap-3 items-center">
            {image && (
              <div className="flex w-12 h-12 relative self-start">
                <Image src={image} fill alt="" className="object-cover rounded" />
              </div>
            )}
            <div className="space-y-1">
              <div className="text-balance">{title}</div>
              {record.categories && record.categories.length > 0 && (
                <div className="flex gap-1.5 flex-wrap">
                  {record.categories.map((category) => (
                    <Badge variant="outline" className="font-normal" key={category.id}>
                      {category.title}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      }
    },
    {
      key: 'active',
      label: 'Активен',
      sortable: true,
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
          <Link href={`/dashboard/products/${id}`}>
            <Button variant="outline" size="sm-icon">
              <PencilIcon className="w-4 h-4" />
            </Button>
          </Link>
          <ApiRemoveDialog url={`products/${id}`} onSuccess={refetch}>
            <Button variant="destructive-outline" size="sm-icon">
              <TrashIcon className="w-4 h-4" />
            </Button>
          </ApiRemoveDialog>
        </div>
      )
    }
  ]

  const filters: DataTableFilterField[] = [
    {
      name: 'query',
      type: 'search',
      placeholder: 'Поиск по названию'
    }
  ]

  return (
    <DataTable<ProductEntity, TasksFilterType>
      data={data.rows}
      total={data.total}
      columns={columns}
      filters={filters}
      {...tasks}
    />
  )
}
