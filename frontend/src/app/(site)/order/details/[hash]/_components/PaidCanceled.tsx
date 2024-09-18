'use client'

import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

export interface PaidCanceledProps {
  paidAt: string | null
}

export function PaidCanceled({ paidAt }: PaidCanceledProps) {
  return (
    <div className="p-6 rounded-lg bg-red-50">
      <div className="flex justify-between items-center mb-4">
        <div className="font-bold">Статус</div>
        {paidAt && (
          <div className="text-xs bg-red-100 text-red-900 rounded font-bold px-2 py-1.5 leading-none">
            {format(paidAt, 'dd.MM.yyyy HH:mm', { locale: ru })}
          </div>
        )}
      </div>
      <div className="text-base">Ваш заказ не был оплачен</div>
    </div>
  )
}
