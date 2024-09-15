'use client'

import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

import { cn } from '@/lib/utils'

import { useOrderDetails } from './OrderDetailsProvider'

export function AwaitingStatus() {
  const [peending, setPeending] = useState(false)
  const orderDetails = useOrderDetails()

  const loadHandler = async () => {
    setPeending(true)
    await orderDetails.refetch()
    setPeending(false)
  }

  return (
    <div className="p-6 rounded-lg bg-yellow-100">
      <div className="flex justify-between items-center mb-4">
        <div className="font-bold">Статус</div>
        <button
          className={
            'text-xs bg-yellow-200 hover:bg-yellow-300 text-yellow-900 rounded font-bold px-2 py-1.5 leading-none flex gap-1 items-center'
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
