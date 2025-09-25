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
import { apiPatch } from '@/lib/api'
import { EditorInput } from '@/lib/EditorInput'
import { ProductEntity } from '@/types'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

export const ProductDescriptionSchema = z.object({
  description: z.string().trim().nullable(),
  specifications: z.string().trim().nullable(),
  exploitation: z.string().trim().nullable()
})

export type ProductDescriptionFields = z.infer<typeof ProductDescriptionSchema>

export interface ProductDescriptionProps {
  record: ProductEntity
}

export function ProductDescription({ record }: ProductDescriptionProps) {
  const form = useForm<ProductDescriptionFields>({
    resolver: zodResolver(ProductDescriptionSchema),
    defaultValues: {
      description: record.description,
      specifications: record.specifications,
      exploitation: record.exploitation
    }
  })

  const onSubmit = async (values: ProductDescriptionFields) => {
    try {
      await apiPatch(`products/${record.id}`, values)
      toast.success('Товар изменен')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Unknown error')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-1 flex-col gap-4 md:gap-6">
        <FormField
          control={form.control}
          name="description"
          render={({ field: { value, onChange } }) => (
            <FormItem>
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <EditorInput value={value || ''} onChange={onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="specifications"
          render={({ field: { value, onChange } }) => (
            <FormItem>
              <FormLabel>Характеристики</FormLabel>
              <FormControl>
                <EditorInput value={value || ''} onChange={onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="exploitation"
          render={({ field: { value, onChange } }) => (
            <FormItem>
              <FormLabel>Правила эксплуатации</FormLabel>
              <FormControl>
                <EditorInput value={value || ''} onChange={onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="p-5 rounded-md flex items-center justify-end gap-4 bg-neutral-50">
          <Link href="/dashboard/products">
            <Button type="button" variant="outline">
              Отмена
            </Button>
          </Link>
          <Button disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting && <ArrowPathIcon className="h-4 w-4 animate-spin" />}
            Сохранить
          </Button>
        </div>
      </form>
    </Form>
  )
}
