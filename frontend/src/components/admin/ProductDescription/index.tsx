'use client'

import { Button, ButtonLoadingIcon } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useApiForm } from '@/lib/ApiForm'
import { EditorInput } from '@/lib/EditorInput'
import { ProductEntity } from '@/types'
import { z } from 'zod'
import { PageLayout } from '../../../app/dashboard/_components/PageLayout'
import { ProductLayout } from '../ProductLayout'

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
    <PageLayout
      title="Описание товара"
      actions={
        <Button disabled={form.formState.isSubmitting} onClick={form.handleSubmit(onSubmit)}>
          {form.formState.isSubmitting && <ButtonLoadingIcon />}
          Сохранить
        </Button>
      }
    >
      <ProductLayout productId={initialData.id}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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
          </form>
        </Form>
      </ProductLayout>
    </PageLayout>
  )
}
