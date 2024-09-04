'use client'

import { Button, ButtonLoadingIcon } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useApiForm } from '@/lib/ApiForm'
import { EditorInput } from '@/lib/EditorInput'
import { ProductEntity } from '@/types'
import Link from 'next/link'
import { z } from 'zod'

export const ProductDescriptionSchema = z.object({
  description: z.string().trim().nullable(),
  specifications: z.string().trim().nullable(),
  exploitation: z.string().trim().nullable()
})

export type ProductDescriptionFields = z.infer<typeof ProductDescriptionSchema>

export interface ProductDescriptionProps {
  initialData: ProductEntity
}

export function ProductDescription({ initialData }: ProductDescriptionProps) {
  const [form, onSubmit] = useApiForm<ProductDescriptionFields>({
    url: `products/${initialData.id}`,
    method: 'PATCH',
    schema: ProductDescriptionSchema,
    defaultValues: {
      description: initialData.description,
      specifications: initialData.specifications,
      exploitation: initialData.exploitation
    }
  })
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="description" className="w-full">
          <div className="flex justify-center">
            <TabsList>
              <TabsTrigger value="description">Описание</TabsTrigger>
              <TabsTrigger value="specifications">Характеристики</TabsTrigger>
              <TabsTrigger value="exploitation">Правила эксплуатации</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="description">
            <FormField
              control={form.control}
              name="description"
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <FormControl>
                    <EditorInput value={value || ''} onChange={onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          <TabsContent value="specifications">
            <FormField
              control={form.control}
              name="specifications"
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <FormControl>
                    <EditorInput value={value || ''} onChange={onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          <TabsContent value="exploitation">
            <FormField
              control={form.control}
              name="exploitation"
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <FormControl>
                    <EditorInput value={value || ''} onChange={onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>
        <div className="p-5 rounded-md flex items-center justify-end gap-4 bg-neutral-50">
          <Link href="/admin/products">
            <Button type="button" variant="outline">
              Отмена
            </Button>
          </Link>
          <Button disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting && <ButtonLoadingIcon />}
            Сохранить
          </Button>
        </div>
      </form>
    </Form>
  )
}
