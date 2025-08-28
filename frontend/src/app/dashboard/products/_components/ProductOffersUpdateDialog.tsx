'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { apiPatch, apiPost } from '@/lib/api'
import { OfferEntity, PropertyEntity } from '@/types'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { useToggle } from '@reactuses/core'
import { PropsWithChildren } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

export interface ProductOffersUpdateDialogProps {
  productId: number
  offer: OfferEntity
  properties: Record<string, { property: PropertyEntity; options: string[] } | undefined>
  onSuccess?: () => void
}

interface Fields {
  price: string
  title: string
  options: Record<string, string | undefined>
}

export function ProductOffersUpdateDialog({
  productId,
  offer,
  properties,
  children,
  onSuccess
}: PropsWithChildren<ProductOffersUpdateDialogProps>) {
  const [show, toggleShow] = useToggle(false)
  const [loading, toggleLoading] = useToggle(false)
  const form = useForm<Fields>({
    defaultValues: {
      price: String(offer.price),
      title: offer.title || '',
      options: (offer.options || []).reduce(
        (previousValue, option) => ({
          ...previousValue,
          [option.name]: option.content
        }),
        {}
      )
    }
  })

  const onSubmit: SubmitHandler<Fields> = async (data) => {
    toggleLoading()

    try {
      await apiPatch(`products/${productId}/offers/${offer.id}`, {
        title: data.title,
        price: Number(data.price),
        options: data.options
      })
      toast.success('Сохранено')
      // form.reset()
      onSuccess?.()
      toggleShow(false)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      toggleLoading()
    }
  }

  return (
    <Dialog open={show} onOpenChange={toggleShow}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <DialogHeader>
              <DialogTitle>Редактировать вариант</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0">
                    <FormLabel className="text-right">Название</FormLabel>
                    <FormControl className="col-span-3">
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                rules={{ required: 'Укажите цену' }}
                name="price"
                render={({ field }) => (
                  <div>
                    <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0">
                      <FormLabel className="text-right">Цена</FormLabel>
                      <FormControl className="col-span-3">
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                    <div className="grid grid-cols-4 gap-4 mt-2">
                      <div />
                      <div className="col-span-3">
                        <FormMessage />
                      </div>
                    </div>
                  </div>
                )}
              />
              {Object.values(properties)
                .filter((v) => !!v)
                .map(({ property, options }) => (
                  <FormField
                    key={property.id}
                    control={form.control}
                    name={`options.${property.key}`}
                    render={({ field: { value, onChange, ref, ...field } }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0">
                        <FormLabel className="text-right">{property.caption}</FormLabel>
                        <FormControl className="col-span-3">
                          <Select onValueChange={onChange} value={value || ''} {...field}>
                            <SelectTrigger className="col-span-3">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {options.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
            </div>
            <DialogFooter>
              <Button disabled={loading} type="submit">
                {loading && <ArrowPathIcon className="h-4 w-4 animate-spin" />}
                Сохранить
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
