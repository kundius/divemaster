'use client'

import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useOrderStore } from '@/providers/order-store-provider'

import css from './Submit.module.scss'

export function Submit() {
  const orderState = useOrderStore((state) => state)
  const [wobble, setWobble] = useState(false)

  const submitHandler = () => {
    const isValid = orderState.validate()

    if (!isValid) {
      toast.error('Для оформления заказа необходимо указать все недостающие данные.')
      setWobble(true)
      setTimeout(() => setWobble(false), 600)
      return
    }

    toast.success('пошли отправлять')

    console.log({
      deliveryMethod: orderState.delivery?.method,
      deliveryAddress: orderState.delivery?.address,
      paymentMethod: orderState.payment?.method,
      recipientName: orderState.recipient?.name,
      recipientEmail: orderState.recipient?.email,
      recipientPhone: orderState.recipient?.phone,
      personalDiscountEnabled: orderState.personalDiscountEnabled,
      legalEntity: orderState.legalEntity,
      agreement: orderState.agreement
    })
  }

  return (
    <Button
      className={cn('w-full uppercase font-sans-narrow', {
        [css.wobble]: wobble
      })}
      size="lg"
      type="button"
      onClick={submitHandler}
    >
      Оформить заказ
    </Button>
  )
}
