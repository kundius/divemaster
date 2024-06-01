'use client'

import { ApiInputComboBox } from '@/components/lib/ApiInputComboBox'
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
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

export const ProductFormSchema = z.object({
  title: z.string().trim().min(1),
  alias: z.string().trim(),
  sku: z.string().trim().nullable(),
  longTitle: z.string().trim().nullable(),
  description: z.string().trim().nullable(),
  price: z.number(),
  oldPrice: z.number().nullable(),
  brandId: z.number().nullable(),
  active: z.boolean(),
  recent: z.boolean(),
  favorite: z.boolean(),
  inStock: z.boolean()
})

export type ProductFormFields = z.infer<typeof ProductFormSchema>

export interface ProductFormProps {
  form: UseFormReturn<ProductFormFields, any, undefined>
  onSubmit: (values: ProductFormFields) => Promise<void>
}

export function ProductForm({ form, onSubmit }: ProductFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <div className="flex gap-6">
            <div className="w-1/2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-1/2">
              <FormField
                control={form.control}
                name="alias"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Псевдоним</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex gap-6">
            <div className="w-1/2">
              <FormField
                control={form.control}
                name="brandId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Бренд</FormLabel>
                    <FormControl>
                      <ApiInputComboBox
                        url="brands"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-1/2">
              <FormField
                control={form.control}
                name="sku"
                render={({ field: { value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Артикул</FormLabel>
                    <FormControl>
                      <Input value={value || ''} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex gap-6">
            <div className="w-1/2">
              <FormField
                control={form.control}
                name="price"
                render={({ field: { onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Цена</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        onChange={(e) => onChange(Number(e.target.value))}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-1/2">
              <FormField
                control={form.control}
                name="oldPrice"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Старая цена</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        onChange={(e) => onChange(!e.target.value ? null : Number(e.target.value))}
                        value={value === null ? '' : value}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <FormField
            control={form.control}
            name="longTitle"
            render={({ field: { value, ...field } }) => (
              <FormItem>
                <FormLabel>Расширенное название</FormLabel>
                <FormControl>
                  <Input value={value || ''} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field: { value, ...field } }) => (
              <FormItem>
                <FormLabel>Описание</FormLabel>
                <FormControl>
                  <Textarea value={value || ''} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-wrap gap-x-12 gap-y-6">
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Активен</FormLabel>
                  <FormControl>
                    <div className="w-full">
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="favorite"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Популярный</FormLabel>
                  <FormControl>
                    <div className="w-full">
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="recent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Новый</FormLabel>
                  <FormControl>
                    <div className="w-full">
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="inStock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>В наличии</FormLabel>
                  <FormControl>
                    <div className="w-full">
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button loading={form.formState.isSubmitting} type="submit">
            Сохранить
          </Button>
        </div>
      </form>
    </Form>
  )
}
