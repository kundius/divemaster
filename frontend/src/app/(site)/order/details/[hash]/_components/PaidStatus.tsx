'use client'

import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

import { useOrderDetails } from './OrderDetailsProvider'

export function PaidStatus() {
  const orderDetails = useOrderDetails()
  return (
    <div className="p-6 rounded-lg bg-emerald-100">
      <div className="flex justify-between items-center mb-4">
        <div className="font-bold">Статус</div>
        <div className="text-xs bg-green-200 text-green-900 rounded font-bold px-2 py-1.5 leading-none">
          {format(orderDetails.data.payment.paidAt, 'dd.MM.yyyy HH:mm', { locale: ru })}
        </div>
      </div>
      <div className="text-base">Ваш заказ успешно оплачен</div>
    </div>
  )
}
