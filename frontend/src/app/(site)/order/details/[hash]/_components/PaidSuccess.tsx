'use client'

import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

export interface PaidSuccessProps {
  paidAt: string | null
}

export function PaidSuccess({ paidAt }: PaidSuccessProps) {
  return (
    <div className="p-6 rounded-lg bg-emerald-50 max-md:p-5">
      <div className="flex justify-between items-center mb-4">
        <div className="font-bold">Статус</div>
        {paidAt && (
          <div className="text-xs bg-emerald-100 text-emerald-900 rounded font-bold px-2 py-1.5 leading-none">
            {format(paidAt, 'dd.MM.yyyy HH:mm', { locale: ru })}
          </div>
        )}
      </div>
      <div className="text-base">Ваш заказ успешно оплачен</div>
    </div>
  )
}
