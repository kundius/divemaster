'use client'

import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

import { cn } from '@/lib/utils'
import { OrderEntity } from '@/types'

export interface PaidPeendingProps {
  onRefresh: () => Promise<OrderEntity | undefined>
}

export function PaidPeending({ onRefresh }: PaidPeendingProps) {
  const [peending, setPeending] = useState(false)

  const loadHandler = async () => {
    setPeending(true)
    await onRefresh()
    setPeending(false)
  }

  return (
    <div className="p-6 rounded-lg bg-amber-50">
      <div className="flex justify-between items-center mb-4">
        <div className="font-bold">Статус</div>
        <button
          className={
            'text-xs bg-amber-100 hover:bg-amber-200 text-amber-900 rounded font-bold px-2 py-1.5 leading-none flex gap-1 items-center'
          }
          onClick={loadHandler}
        >
          <ArrowPathIcon
            className={cn('w-3 h-3', {
              'animate-spin': peending
            })}
          />
          обновить
        </button>
      </div>
      <div className="text-base">Ваш заказ ожидает оплаты</div>
    </div>
  )
}
