'use client'

import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useOrderStore } from '@/providers/order-store-provider'

import css from './Submit.module.scss'
import { apiPost } from '@/lib/api'
import { useCartStore } from '@/providers/cart-store-provider'
import { useRouter } from 'next/navigation'
import { OrderEntity } from '@/types'

export function Submit() {
  const router = useRouter()
  const cartId = useCartStore((state) => state.cartId)
  const orderState = useOrderStore((state) => state)
  const [wobble, setWobble] = useState(false)

  const submitHandler = async () => {
    if (!cartId) {
      throw new Error('Cart not found')
    }

    const isValid = orderState.validate()

    if (!isValid) {
      toast.error('Для оформления заказа необходимо указать все недостающие данные.')
      setWobble(true)
      setTimeout(() => setWobble(false), 600)
      return
    }

    const result = await apiPost<OrderEntity>(`cart/${cartId}/create-order`, {
      deliveryService: orderState.delivery?.service,
      deliveryAddress: orderState.delivery?.address,
      paymentService: orderState.payment?.service,
      recipientName: orderState.recipient?.name,
      recipientEmail: orderState.recipient?.email,
      recipientPhone: orderState.recipient?.phone,
      personalDiscount: orderState.personalDiscount,
      legalEntity: orderState.legalEntity,
      agreement: orderState.agreement
    })

    router.push(`/order/details/${result.hash}`)
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