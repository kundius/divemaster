'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useOrderStore } from '@/providers/order-store-provider'
import { DeliveryMethod } from '@/types'

interface ShippingFormFields {
  city: string
  street: string
  house: string
  apartment: string
  intercom: string
  floor: string
  entrance: string
}

export function ShippingForm() {
  const orderState = useOrderStore((state) => state)
  const router = useRouter()

  const form = useForm<ShippingFormFields>({
    defaultValues: {
      city: '',
      street: '',
      house: '',
      apartment: '',
      intercom: '',
      floor: '',
      entrance: ''
    }
  })

  function onSubmit(values: ShippingFormFields) {
    let tmp = [values.city, values.street, values.house]

    if (values.apartment) {
      tmp.push(`кв/офис ${values.apartment}`)
    }

    if (values.entrance) {
      tmp.push(`подъезд ${values.entrance}`)
    }

    if (values.floor) {
      tmp.push(`этаж ${values.floor}`)
    }

    if (values.intercom) {
      tmp.push(`домофон ${values.intercom}`)
    }

    orderState.setDelivery({
      method: DeliveryMethod.SHIPPING,
      address: tmp.join(', ')
    })
    router.push('/order')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="min-h-full flex flex-col gap-4">
        <div className="font-bold">Адрес доставки</div>
        <FormField
          control={form.control}
          name="city"
          rules={{
            required: true
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Город <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="street"
          rules={{
            required: true
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Улица <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <FormField
              control={form.control}
              name="house"
              rules={{
                required: true
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Номер дома <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="apartment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Кв/офис</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <FormField
              control={form.control}
              name="entrance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Подъезд</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="floor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Этаж</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="intercom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Домофон</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex-grow" />
        <Button size="lg" type="submit" className="w-full">
          Доставить сюда
        </Button>
      </form>
    </Form>
  )
}
