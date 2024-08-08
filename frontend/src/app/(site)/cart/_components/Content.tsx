'use client'

import Link from 'next/link'

import { PrimaryButton } from '@/components/site/PrimaryButton'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/providers/auth-store-provider'
import { useCartStore } from '@/providers/cart-store-provider'

import { cn } from '@/lib/utils'
import { Auth } from './Auth'
import styles from './Content.module.scss'
import { Headline } from './Headline'
import { LegalEntity } from './LegalEntity'
import { OrderInfo, OrderInfoProps } from './OrderInfo'
import { Product } from './Product'
import { useState } from 'react'
import { apiPut } from '@/lib/api'
import { withClientAuth } from '@/lib/api/with-client-auth'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export function Content() {
  const authStore = useAuthStore((state) => state)
  const cartStore = useCartStore((state) => state)
  const [legalEntity, setLegalEntity] = useState(false)
  const [sendOpened, setSendOpened] = useState(false)
  const [loading, setLoading] = useState(false)
  const [personalDiscount, setPersonalDiscount] = useState(false)
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerName, setCustomerName] = useState('')

  if (cartStore.total.count === 0) {
    return (
      <div>
        <div className="text-4xl font-sans-narrow uppercase font-bold mb-4">Корзина пуста</div>
        <div className="space-y-1">
          <p>Воспользуйтесь поиском, чтобы найти всё, что нужно.</p>
          {!authStore.user && <p>Если в Корзине были товары, войдите, чтобы посмотреть список.</p>}
        </div>
        {!authStore.user && (
          <div className="mt-4">
            <Link href="/auth/signin">
              <PrimaryButton>Войти</PrimaryButton>
            </Link>
          </div>
        )}
      </div>
    )
  }

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

  const submitHandler = async () => {
    setLoading(true)
    const response = await apiPut(
      `cart/${cartStore.cartId}`,
      { customerPhone, customerEmail, customerName },
      withClientAuth()
    )
    setLoading(false)
    setSendOpened(false)
    // cartStore.deleteCart()
    toast.success('Ваша заявка успешно оформлена!')
    console.log(cartStore.cartId, response)
  }

  return (
    <div>
      <div className="text-4xl font-sans-narrow uppercase font-bold mb-4">Корзина</div>

      <div className={styles.layout}>
        <div className={styles.layoutMain}>
          <Headline />
          {cartStore.cartProducts.map((item) => (
            <Product key={item.id} cartProduct={item} />
          ))}
        </div>
        <div className={cn('space-y-4', styles.layoutSide)}>
          <OrderInfo totalCost={cartStore.total.price} prices={getOrderPrices()} />
          <Auth checked={personalDiscount} onCheckedChange={setPersonalDiscount} />
          <Dialog open={sendOpened} onOpenChange={setSendOpened}>
            <DialogTrigger asChild>
              <Button className="w-full uppercase font-sans-narrow" size="lg" type="button">
                Перейти к оформлению
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[440px]">
              <DialogHeader>
                <DialogTitle>Оформление заказа</DialogTitle>
                <DialogDescription>
                  Онлайн оплата на техничеком обслуживании.
                  <br />
                  Наш менеджер свяжется с вами.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Имя:</Label>
                  <Input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Телефон:</Label>
                  <Input
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">E-mail:</Label>
                  <Input
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={submitHandler} loading={loading}>
                  Отправить
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <LegalEntity checked={legalEntity} onCheckedChange={setLegalEntity} />
        </div>
      </div>
    </div>
  )
}
