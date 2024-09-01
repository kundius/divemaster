'use client'

import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/providers/auth-store-provider'
import { useCartStore } from '@/providers/cart-store-provider'

import { Auth } from '../../cart/_components/Auth'
import styles from './Content.module.scss'
import { OrderInfo, OrderInfoProps } from '../../cart/_components/OrderInfo'
import { useState } from 'react'
import { PersonalDiscount } from '../../cart/_components/PersonalDiscount'
import { Agreement } from './Agreement'
import { Agreements } from './Agreements'

export function Content() {
  const authStore = useAuthStore((state) => state)
  const cartStore = useCartStore((state) => state)
  const [personalDiscount, setPersonalDiscount] = useState(false)

  const getOrderPrices = () => {
    const prices: OrderInfoProps['prices'] = []

    prices.push({
      label: `Товары, ${cartStore.total.count} шт.`,
      value: cartStore.total.oldPrice
    })

    prices.push({
      label: `Скидки и акции`,
      value: cartStore.total.discount,
      negative: true
    })

    return prices
  }

  return (
    <div>
      <div className="text-4xl font-sans-narrow uppercase font-bold mb-4">Оформление заказа</div>

      <div className={styles.layout}>
        <div className={styles.layoutMain}>oder</div>
        <div className={styles.layoutSide}>
          <div className="sticky top-32 space-y-4">
            <OrderInfo totalCost={cartStore.total.price} prices={getOrderPrices()} />
            {!authStore.user ? (
              <Auth />
            ) : (
              <PersonalDiscount checked={personalDiscount} onCheckedChange={setPersonalDiscount} />
            )}
            <Agreement />
            <Button className="w-full uppercase font-sans-narrow" size="lg" type="button">
              Оформить заказ
            </Button>
            <Agreements />
          </div>
        </div>
      </div>
    </div>
  )
}
