import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Metadata } from 'next'

import { Headline } from '@/components/Headline'
import { Container } from '@/components/site/Container'
import { apiGet } from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import { DeliveryService, OrderEntity, PageProps } from '@/types'

import { PaymentContainer } from './_components/PaymentContainer'
import { SectionPage } from '@/components/SectionPage'

export const metadata: Metadata = {
  title: 'Информация о заказе'
}

const DeliveryServiceNames: Record<DeliveryService, string> = {
  [DeliveryService.Pickup]: 'Самовывоз',
  [DeliveryService.Shipping]: 'Доставка'
}

export default async function Page({ params }: PageProps<{ hash: string }>) {
  const { hash } = await params
  const order = await apiGet<OrderEntity>(`order/hash:${hash}`)
  if (!order.delivery) {
    throw new Error('delivery not defined')
  }
  return (
    <SectionPage>
      <div className="max-w-7xl mx-auto">
        <Headline className="mb-8 max-md:mb-6" title="Информация о заказе" />
        <div className="flex gap-20 max-md:flex-col max-md:gap-8 max-lg:gap-6 max-xl:gap-10">
          <div className="flex-grow w-full">
            <div className="border rounded-xl divide-y">
              <div className="px-7 py-9 max-lg:px-5 max-lg:py-5 max-md:px-2 max-md:py-6">
                <div className="font-bold text-base mb-4">Доставка</div>
                <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
                  <div className="flex flex-col space-y-1">
                    <div className="text-neutral-500 text-sm leading-none">Способ получения:</div>
                    <div className="text-neutral-800">
                      {DeliveryServiceNames[order.delivery.service]}
                    </div>
                  </div>
                  <div className="col-span-2 flex flex-col space-y-1 max-md:col-span-1">
                    <div className="text-neutral-500 text-sm leading-none">Адрес:</div>
                    <div className="text-neutral-800 text-balance">{order.delivery.address}</div>
                  </div>
                </div>
              </div>
              <div className="px-7 py-9 max-lg:px-5 max-lg:py-5 max-md:px-2 max-md:py-6">
                <div className="font-bold text-base mb-4">Данные получателя</div>
                <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-md:grid-cols-1">
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
                <div className="px-7 py-9 max-lg:px-5 max-lg:py-5 max-md:px-2 max-md:py-6">
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
          <div className="flex-shrink-0 w-full md:w-[280px] lg:w-[300px] xl:w-[360px]">
            <div className="sticky top-32 space-y-4">
              <div className="px-6 py-8 border rounded-xl max-xl:py-6 max-md:p-5">
                <div className="font-bold uppercase text-lg leading-none mb-5 max-xl:mb-6 max-xl:text-sm max-xl:leading-none">
                  Ваш заказ
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="text-sm max-xl:text-xs">Номер заказа</div>
                    <div className="font-bold text-base max-xl:text-sm">{order.number}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm max-xl:text-xs">Дата оформления</div>
                    <div className="font-bold text-base max-xl:text-sm">
                      {format(order.createdAt, 'dd.MM.yyyy HH:mm', { locale: ru })}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-6 max-xl:mt-4">
                  <div className="font-bold text-lg leading-none max-xl:text-sm max-xl:leading-none">
                    К оплате
                  </div>
                  <div className="font-bold text-base leading-none text-primary">
                    {formatPrice(order.cost)}
                  </div>
                </div>
              </div>
              <PaymentContainer hash={hash} />
            </div>
          </div>
        </div>
      </div>
    </SectionPage>
  )
}
