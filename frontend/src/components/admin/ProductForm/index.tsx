'use client'

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
import { VespInputComboBox } from '@/components/vesp/VespInputComboBox'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

export const ProductFormSchema = z.object({
  title: z.string().trim().min(1),
  sku: z.string().trim().min(1),
  description: z.string().trim(),
  price: z.number(),
  active: z.boolean(),
  // category_id: z.number()
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
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Описание</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Категория</FormLabel>
                <FormControl>
                  <VespInputComboBox
                    url="admin/categories"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Артикул</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <Button loading={form.formState.isSubmitting} type="submit">
            Сохранить
          </Button>
        </div>
      </form>
    </Form>
  )
}
