'use client'

import {
  CheckCircleIcon,
  PencilIcon,
  SquaresPlusIcon,
  TrashIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryStates } from 'nuqs'
import useSWR from 'swr'

import { DataTable, DataTableColumn, DataTableFilterField } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { ApiRemoveDialog } from '@/lib/ApiRemoveDialog'
import { clearEmpty } from '@/lib/utils'
import { FindAllResult, PropertyEntity } from '@/types'

export interface PropertyListProps {
  fallbackData?: FindAllResult<PropertyEntity>
}

export function PropertyList({ fallbackData }: PropertyListProps) {
  const [pagination, setPagination] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      limit: parseAsInteger.withDefault(10)
    },
    {
      clearOnDefault: true
    }
  )

  const [sorting, setSorting] = useQueryStates({
    sort: parseAsString,
    dir: parseAsString
  })

  const [filter, setFilter] = useQueryStates({
    query: parseAsString,
    tags: parseAsArrayOf(parseAsString)
  })

  const { data, isLoading, mutate } = useSWR<FindAllResult<PropertyEntity>>(
    [
      `properties`,
      {
        ...pagination,
        ...clearEmpty(sorting),
        ...clearEmpty(filter)
      }
    ],
    {
      fallbackData,
      keepPreviousData: true
    }
  )

  const refetch = () => mutate(data, { revalidate: true })

  const columns: DataTableColumn<PropertyEntity>[] = [
    {
      key: 'id',
      label: 'ID'
    },
    {
      key: 'key',
      label: 'Ключ'
    },
    {
      key: 'caption',
      label: 'Подпись'
    },
    {
      key: 'type',
      label: 'Тип'
    },
    {
      key: 'inFilter',
      label: 'Фильтр',
      headProps: {},
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
          <Link href={`/dashboard/properties/${id}`}>
            <Button variant="outline" size="icon">
              <PencilIcon className="w-4 h-4" />
            </Button>
          </Link>
          <Link href={`/dashboard/properties/${id}/categories`}>
            <Button variant="outline" size="icon">
              <SquaresPlusIcon className="w-4 h-4" />
            </Button>
          </Link>
          <ApiRemoveDialog url={`properties/${id}`} onSuccess={refetch}>
            <Button variant="outline-destructive" size="icon">
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

  const { rows, total } = data || { rows: [], total: 0 }

  return (
    <DataTable<PropertyEntity, typeof filter>
      data={rows}
      total={total}
      isLoading={isLoading}
      columns={columns}
      filters={filters}
      filter={filter}
      setFilter={setFilter}
      sorting={sorting}
      setSorting={setSorting}
      pagination={pagination}
      setPagination={setPagination}
    />
  )
}
