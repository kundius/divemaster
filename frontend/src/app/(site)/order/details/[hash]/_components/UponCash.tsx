'use client'

import { SpriteIcon } from '@/components/SpriteIcon'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function UponCash() {
  return (
    <Alert>
      <SpriteIcon name="payment-wallet" size={16} />
      <AlertTitle>Выбрана оплата наличными</AlertTitle>
      <AlertDescription className="text-balance">
        Статус заказа обновится в ручном режиме после получения средств
      </AlertDescription>
    </Alert>
  )
}
