'use client'

import { ApiInputComboBox } from '@/components/lib/ApiInputComboBox'
import { ApiInputFile } from '@/components/lib/ApiInputFile'
import { EditorInput } from '@/components/lib/EditorInput'
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
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

export const CategoryFormSchema = z.object({
  title: z.string().trim().min(1),
  alias: z.string().trim(),
  longTitle: z.string().trim().nullable(),
  description: z.string().trim().nullable(),
  parentId: z.number().nullable(),
  imageId: z.number().nullable(),
  active: z.boolean()
})

export type CategoryFormFields = z.infer<typeof CategoryFormSchema>

export interface CategoryFormProps {
  form: UseFormReturn<CategoryFormFields, any, undefined>
  onSubmit: (values: CategoryFormFields) => Promise<void>
}

export function CategoryForm({ form, onSubmit }: CategoryFormProps) {
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
                name="parentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Родительская</FormLabel>
                    <FormControl>
                      <ApiInputComboBox
                        url="categories"
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
                name="imageId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Изображение</FormLabel>
                    <FormControl>
                      <ApiInputFile
                        value={field.value}
                        onChange={field.onChange}
                        allowedTypes={['image/jpeg', 'image/png']}
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
            name="active"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Активна</FormLabel>
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
