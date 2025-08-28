'use client'

import { Trash2Icon, InfoIcon } from 'lucide-react'
import Link from 'next/link'
import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryStates } from 'nuqs'
import useSWR from 'swr'
import { DataTable, DataTableColumn, DataTableFilterField } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { ApiRemoveDialog } from '@/lib/ApiRemoveDialog'
import { clearEmpty, formatPrice, getFileUrl } from '@/lib/utils'
import { OrderEntity, FindAllResult } from '@/types'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import Image from 'next/image'
import { OrderDetailsDialog } from './OrderDetailsDialog'

export interface OrderListProps {
  fallbackData?: FindAllResult<OrderEntity>
}

export function OrderList({ fallbackData }: OrderListProps) {
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
    query: parseAsString
  })

  const { data, isLoading, mutate } = useSWR<FindAllResult<OrderEntity>>(
    [
      `orders`,
      {
        withParent: true,
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

  const getStatus = (row: OrderEntity) => {
    if (row.delivery?.delivered) {
      return (
        <Badge variant="secondary" className="bg-green-100 hover:bg-green-100">
          Доставлен
        </Badge>
      )
    }
    if (row.payment?.paid) {
      return (
        <Badge variant="secondary" className="bg-blue-100 hover:bg-blue-100">
          Оплачен
        </Badge>
      )
    }
    return (
      <Badge variant="secondary" className="bg-yellow-100 hover:bg-yellow-100">
        Создан
      </Badge>
    )
  }

  const columns: DataTableColumn<OrderEntity>[] = [
    {
      key: 'number',
      label: 'Номер',
      headProps: {},
      formatter: (number, row) => {
        return <Badge variant="outline">{number}</Badge>
      }
    },
    {
      key: 'createdAt',
      label: 'Дата',
      sortable: true,
      headProps: {
        className: 'whitespace-nowrap'
      },
      formatter: (createdAt) => format(createdAt, 'dd MMMM, HH:mm')
    },
    {
      key: 'cost',
      label: 'Стоимость',
      headProps: {
        className: 'whitespace-nowrap'
      },
      formatter: (cost) => formatPrice(cost)
    },
    {
      key: 'id',
      label: 'Статус',
      headProps: {
        className: 'whitespace-nowrap'
      },
      formatter: (_, row) => getStatus(row)
    },
    {
      key: 'id',
      headProps: {
        className: 'w-0'
      },
      formatter: (id, row) => (
        <div className="flex gap-2">
          <OrderDetailsDialog order={row}>
            <Button variant="outline" size="icon">
              <InfoIcon className="w-4 h-4" />
            </Button>
          </OrderDetailsDialog>
          <ApiRemoveDialog url={`orders/${id}`} onSuccess={refetch}>
            <Button variant="outline-destructive" size="icon">
              <Trash2Icon className="w-4 h-4" />
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
      placeholder: 'Поиск по номеру'
    }
  ]

  const { rows, total } = data || { rows: [], total: 0 }

  return (
    <DataTable<OrderEntity, typeof filter>
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
