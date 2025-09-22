'use client'

import { Pagination } from '@/components/Pagination'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { FindAllResult, OrderEntity } from '@/types'
import {
  ArrowTopRightOnSquareIcon,
  BanknotesIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useState } from 'react'
import useSWR from 'swr'
import { format } from 'date-fns'
import labels from '@/lib/labels'
import { formatPrice } from '@/lib/utils'
import { SpriteIcon } from '@/components/SpriteIcon'

export function ProfileOrders() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(5)
  const { data, isLoading } = useSWR<FindAllResult<OrderEntity>>(['orders/user', { limit, page }], {
    keepPreviousData: true
  })
  const { rows, total } = data || { rows: [], total: 0 }

  const getStatus = (row: OrderEntity) => {
    if (row.delivery?.delivered) {
      return 'Доставлен'
    }
    if (row.payment?.paid) {
      return 'Оплачен'
    }
    return 'Создан'
  }

  const getStatusIcon = (row: OrderEntity) => {
    if (row.delivery?.delivered) {
      return <SpriteIcon name="delivery" className="text-green-600" />
    }
    if (row.payment?.paid) {
      return <BanknotesIcon className="w-6 h-6 text-blue-600" />
    }
    return <ClipboardDocumentCheckIcon className="w-6 h-6 text-yellow-600" />
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
        <div className="space-y-4">
          {rows.map((row) => (
            <div key={row.id} className="border rounded-md p-4">
              <div className="flex gap-2">
                <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                  {getStatusIcon(row)}
                </div>

                <div className="flex-grow">
                  <div className="flex items-center justify-between gap-x-4">
                    <div className="flex items-center flex-wrap gap-x-4 max-md:flex-col max-md:items-start">
                      <div className="text-lg font-medium">Заказ № {row.number}</div>

                      <div className="text-sm text-neutral-500">
                        от {format(row.createdAt, 'dd.MM.yyyy')}
                      </div>

                      <div className="text-lg font-medium text-primary">
                        {formatPrice(row.cost)}
                      </div>
                    </div>

                    <Button variant="outline" asChild className="max-md:hidden">
                      <Link href={`/order/details/${row.hash}`} target="_blank">
                        <ArrowTopRightOnSquareIcon className="w-4 h-4 -ml-1 mr-1" />
                        Информация о заказе
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1">
                <div className="flex items-center gap-1">
                  <div className="text-sm font-medium text-neutral-800">Статус заказа:</div>
                  <div className="text-sm text-neutral-600">{getStatus(row)}</div>
                </div>

                {row.payment && (
                  <div className="flex items-center gap-1">
                    <div className="text-sm font-medium text-neutral-800">Способ оплаты:</div>
                    <div className="text-sm text-neutral-600">
                      {labels.PaymentService[row.payment.service]}
                    </div>
                  </div>
                )}

                {row.delivery && (
                  <div className="flex items-center gap-1">
                    <div className="text-sm font-medium text-neutral-800">Способ получения:</div>
                    <div className="text-sm text-neutral-600">
                      {labels.DeliveryService[row.delivery.service]}
                    </div>
                  </div>
                )}
              </div>

              <Button
                variant="default"
                size="lg"
                asChild
                className="w-full uppercase font-sans-narrow mt-4 md:hidden"
              >
                <Link href={`/order/details/${row.hash}`} target="_blank">
                  <ArrowTopRightOnSquareIcon className="w-4 h-4 -ml-1 mr-1" />
                  Информация о заказе
                </Link>
              </Button>
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
