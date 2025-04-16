import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import labels from '@/lib/labels'
import { cn, formatPrice } from '@/lib/utils'
import { OrderEntity } from '@/types'
import { format } from 'date-fns'
import { PropsWithChildren } from 'react'

export interface OrderEntityProps {
  order: OrderEntity
}

export function OrderDetailsDialog({ order, children }: PropsWithChildren<OrderEntityProps>) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Заказ № {order.number}</DialogTitle>
          <DialogDescription>от {format(order.createdAt, 'dd MMMM, HH:mm')}</DialogDescription>
        </DialogHeader>

        <div className="divide-y">
          {order.payment && (
            <div className="py-4 last:pb-0 first:pt-0">
              <div className="font-bold text-base mb-4">Оплата</div>

              <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                <div className="flex flex-col space-y-1">
                  <div className="text-neutral-500 text-sm leading-none">Способ получения:</div>
                  <div className="text-neutral-800">
                    {labels.PaymentService[order.payment.service]}
                  </div>
                </div>
              </div>
            </div>
          )}

          {order.delivery && (
            <div className="py-4 last:pb-0 first:pt-0">
              <div className="font-bold text-base mb-4">Доставка</div>

              <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                <div className="flex flex-col space-y-1">
                  <div className="text-neutral-500 text-sm leading-none">Способ получения:</div>
                  <div className="text-neutral-800">
                    {labels.DeliveryService[order.delivery.service]}
                  </div>
                </div>

                <div className="flex flex-col space-y-1">
                  <div className="text-neutral-500 text-sm leading-none">Адрес:</div>
                  <div className="text-neutral-800 text-balance">{order.delivery.address}</div>
                </div>
              </div>
            </div>
          )}

          {order.delivery && (
            <div className="py-4 last:pb-0 first:pt-0">
              <div className="font-bold text-base mb-4">Данные получателя</div>

              <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                <div className="flex flex-col space-y-1">
                  <div className="text-neutral-500 text-sm leading-none">Имя и фамилия:</div>
                  <div className="text-neutral-800">{order.delivery.recipient?.name}</div>
                </div>

                <div className="flex flex-col space-y-1">
                  <div className="text-neutral-500 text-sm leading-none">E-mail:</div>
                  <div className="text-neutral-800">{order.delivery.recipient?.email}</div>
                </div>

                <div className="flex flex-col space-y-1">
                  <div className="text-neutral-500 text-sm leading-none">Телефон:</div>
                  <div className="text-neutral-800">{order.delivery.recipient?.phone}</div>
                </div>
              </div>
            </div>
          )}

          {order.composition && (
            <div className="py-4 last:pb-0 first:pt-0">
              <div className="font-bold text-base mb-4">Состав заказа</div>

              <div className="space-y-4">
                {order.products.map((item) => (
                  <div className="space-y-2" key={item.id}>
                    <div className="flex gap-4 justify-between items-start">
                      <div className="text-base text-balance text-neutral-800">
                        {item.title}, {item.quantity} шт.
                      </div>
                      <div className="font-bold text-base text-nowrap">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                    {item.options && Object.entries(item.options).length > 0 && (
                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                        {Object.entries(item.options).map(([name, value]) => (
                          <div className="flex gap-1" key={`${name}:${value}`}>
                            <div className="text-neutral-500 text-sm">{name}:</div>
                            <div className="text-neutral-800 text-sm">{value}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {order.composition.map((item) => (
                  <div
                    className={cn('space-y-1', {
                      hidden: item.name == 'goods'
                    })}
                    key={item.name}
                  >
                    <div className="flex gap-4 justify-between items-start">
                      <div className="text-base text-balance text-neutral-800">{item.caption}</div>
                      <div
                        className={cn('font-bold text-base text-nowrap', {
                          'text-red-600': item.name == 'personal'
                        })}
                      >
                        {formatPrice(item.value)}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="space-y-1">
                  <div className="flex gap-4 justify-between items-start">
                    <div className="text-base text-balance text-neutral-800">Итого</div>
                    <div className="font-bold text-base text-nowrap text-primary">
                      {formatPrice(order.cost)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
