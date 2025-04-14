'use client'

import { Pagination } from '@/components/site/Pagination'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ApiClient } from '@/lib/api-client'
import { FindAllResult, OrderEntity } from '@/types'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useState } from 'react'
import useSWR from 'swr'
import { format } from 'date-fns'
import labels from '@/lib/labels'
import { formatPrice } from '@/lib/utils'

export function ProfileOrders() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(5)
  const { data, isLoading } = useSWR<FindAllResult<OrderEntity>>(
    ['auth/profile/orders', { limit, page }],
    {
      keepPreviousData: true
    }
  )
  const { rows, total } = data || { rows: [], total: 0 }

  const renderStatus = (row: OrderEntity) => {
    if (row.delivery?.delivered) {
      return (
        <Badge variant="secondary" className="bg-blue-100 hover:bg-blue-100">
          Доставлен
        </Badge>
      )
    }
    if (row.payment?.paid) {
      return (
        <Badge variant="secondary" className="bg-green-100 hover:bg-green-100">
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

  return (
    <div className="space-y-8">
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex flex-col gap-2 border rounded-md p-4">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-6 w-3/5" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {rows.map((row) => (
            <div key={row.id} className="flex flex-col gap-2 border rounded-md p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-base font-medium">
                    <span className="text-neutral-500">Номер заказа:</span> {row.number}
                  </div>
                  {renderStatus(row)}
                </div>
                <Button variant="outline" asChild>
                  <Link href={`/order/details/${row.hash}`} target="_blank">
                    <ArrowTopRightOnSquareIcon className="w-4 h-4 -ml-1 mr-1" />
                    Информация о заказе
                  </Link>
                </Button>
              </div>
              <div className="h-px bg-border my-2" />
              <div className="flex gap-8 items-start justify-between">
                <div className="flex flex-wrap gap-x-8 gap-y-4">
                  <div className="flex flex-col space-y-1 whitespace-nowrap">
                    <div className="text-neutral-500 text-sm leading-none">Дата оформления:</div>
                    <div className="text-neutral-800">
                      {format(row.createdAt, 'dd.MM.yyyy HH:mm')}
                    </div>
                  </div>
                  {row.payment && (
                    <div className="flex flex-col space-y-1 whitespace-nowrap">
                      <div className="text-neutral-500 text-sm leading-none">Способ оплаты:</div>
                      <div className="text-neutral-800">
                        {labels.PaymentService[row.payment.service]}
                      </div>
                    </div>
                  )}
                  {row.delivery && (
                    <div className="flex flex-col space-y-1 whitespace-nowrap">
                      <div className="text-neutral-500 text-sm leading-none">Способ получения:</div>
                      <div className="text-neutral-800">
                        {labels.DeliveryService[row.delivery.service]}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col space-y-1 whitespace-nowrap">
                  <div className="text-neutral-500 text-sm leading-none">К оплате:</div>
                  <div className="font-bold text-primary">{formatPrice(row.cost)}</div>
                </div>
                {/* <div className="flex items-center gap-2">
                  <div className="text-base">К оплате:</div>
                  <div className="text-base font-bold text-primary">{formatPrice(row.cost)}</div>
                </div> */}
              </div>
            </div>
          ))}
        </div>
      )}
      {total > limit && (
        <div className="flex justify-center">
          <Pagination
            limit={limit}
            page={page}
            total={total}
            onChange={(page: number, limit: number) => {
              setPage(page)
              setLimit(limit)
            }}
          />
        </div>
      )}
    </div>
  )
}
