import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Metadata } from 'next'

import { Headline } from '@/components/Headline'
import { Container } from '@/components/site/Container'
import { apiGet } from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import { DeliveryService, OrderEntity } from '@/types'

import { OrderDetailsProvider } from './_components/OrderDetailsProvider'
import { Payment } from './_components/Payment'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Информация о заказе'
}

const DeliveryServiceNames: Record<DeliveryService, string> = {
  [DeliveryService.Pickup]: 'Самовывоз',
  [DeliveryService.Shipping]: 'Доставка'
}

export default async function Page({ params: { hash } }: { params: { hash: string } }) {
  const order = await apiGet<OrderEntity>(`order/hash:${hash}`)
  return (
    <OrderDetailsProvider hash={hash} fallbackData={order}>
      <div className="pt-12 pb-40">
        <Container small>
          <Headline className="mb-8" title="Информация о заказе" />
          <div className="flex gap-20">
            <div className="w-2/3 flex-grow">
              <div className="border rounded-xl divide-y">
                <div className="py-9 px-7">
                  <div className="font-bold text-base mb-4">Доставка</div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col space-y-1">
                      <div className="text-neutral-500 text-sm leading-none">Способ получения:</div>
                      <div className="text-neutral-800">
                        {DeliveryServiceNames[order.delivery.service]}
                      </div>
                    </div>
                    <div className="col-span-2 flex flex-col space-y-1">
                      <div className="text-neutral-500 text-sm leading-none">Адрес:</div>
                      <div className="text-neutral-800 text-balance">{order.delivery.address}</div>
                    </div>
                  </div>
                </div>
                <div className="py-9 px-7">
                  <div className="font-bold text-base mb-4">Данные получателя</div>
                  <div className="grid grid-cols-3 gap-4">
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
                {order.composition && (
                  <div className="py-9 px-7">
                    <div className="font-bold text-base mb-4">Состав заказа</div>
                    <div className="space-y-4">
                      {order.products.map((item) => (
                        <div className="space-y-1" key={item.id}>
                          <div className="flex gap-4 justify-between items-start">
                            <div className="space-y-1">
                              <div className="text-base text-balance text-neutral-800">
                                {item.title}, {item.amount} шт.
                              </div>
                              {item.options && Object.entries(item.options).length > 0 && (
                                <div className="flex gap-4">
                                  {Object.entries(item.options).map(([name, value]) => (
                                    <div className="flex gap-1">
                                      <div className="text-neutral-500 text-sm">{name}:</div>
                                      <div className="text-neutral-800 text-sm">{value}</div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="font-bold text-base text-nowrap">
                              {formatPrice(item.price * item.amount)}
                            </div>
                          </div>
                        </div>
                      ))}
                      {order.composition
                        .filter((item) => !['goods', 'discounts'].includes(item.name))
                        .map((item) => (
                          <div className="space-y-1" key={item.name}>
                            <div className="flex gap-4 justify-between items-start">
                              <div className="text-base text-balance text-neutral-800">
                                {item.caption}
                              </div>
                              <div className="font-bold text-base text-nowrap">
                                {formatPrice(item.value)}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="w-1/3 max-w-[360px]">
              <div className="sticky top-32 space-y-4">
                <div className="px-6 py-8 border rounded-xl">
                  <div className="font-bold uppercase text-lg leading-none mb-5">Ваш заказ</div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="text-sm">Номер заказа</div>
                      <div className="font-bold text-base">{order.id}</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm">Дата оформления</div>
                      <div className="font-bold text-base">
                        {format(order.createdAt, 'dd.MM.yyyy HH:mm', { locale: ru })}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-6">
                    <div className="font-bold text-lg leading-none">К оплате</div>
                    <div className="font-bold text-base leading-none text-primary">
                      {formatPrice(order.cost)}
                    </div>
                  </div>
                </div>
                <Payment />
              </div>
            </div>
          </div>
        </Container>
      </div>
    </OrderDetailsProvider>
  )
}
