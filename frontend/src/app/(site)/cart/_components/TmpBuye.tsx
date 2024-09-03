'use client'

import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { apiPut } from '@/lib/api'
import { withClientAuth } from '@/lib/api/with-client-auth'
import { useCartStore } from '@/providers/cart-store-provider'

export function TmpBuye() {
  const cartId = useCartStore((state) => state.cartId)
  const [sendOpened, setSendOpened] = useState(false)
  const [loading, setLoading] = useState(false)
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerName, setCustomerName] = useState('')

  const submitHandler = async () => {
    setLoading(true)
    const response = await apiPut(
      `cart/${cartId}`,
      { customerPhone, customerEmail, customerName },
      withClientAuth()
    )
    setLoading(false)
    setSendOpened(false)
    // cartStore.deleteCart()
    toast.success('Ваша заявка успешно оформлена!')
  }

  return (
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
  )
}
