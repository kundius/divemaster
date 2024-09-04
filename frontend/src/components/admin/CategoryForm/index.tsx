'use client'

import { ApiInputComboBox } from '@/lib/ApiInputComboBox'
import { ApiInputFile } from '@/lib/ApiInputFile'
import { EditorInput } from '@/lib/EditorInput'
import { Button, ButtonLoadingIcon } from '@/components/ui/button'
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
import Link from 'next/link'

export const CategoryFormSchema = z.object({
  title: z.string().trim().min(1),
  alias: z.string().trim(),
  longTitle: z.string().trim().nullable(),
  description: z.string().trim().nullable(),
  parentId: z.number().nullable(),
  rank: z.number().nullable(),
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
            name="rank"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Порядок</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={value || ''}
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
          <div className="p-5 rounded-md flex items-center justify-end gap-4 bg-neutral-50">
            <Link href="/admin/categories">
              <Button type="button" variant="outline">
                Отмена
              </Button>
            </Link>
            <Button disabled={form.formState.isSubmitting} type="submit">
              {form.formState.isSubmitting && <ButtonLoadingIcon />}
              Сохранить
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
