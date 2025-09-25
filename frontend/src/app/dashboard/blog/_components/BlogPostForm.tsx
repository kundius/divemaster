'use client'

import { Button } from '@/components/ui/button'
import { CreateablePicker } from '@/components/ui/createable-picker'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { ApiInputFile } from '@/lib/ApiInputFile'
import { EditorInput } from '@/lib/EditorInput'
import { BlogPostStatusEnum, BlogTagEntity, FindAllResult } from '@/types'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useFormContext } from 'react-hook-form'
import useSWR from 'swr'
import { z } from 'zod'
import { BlogPostStatusLabels } from '../data'

export const BlogPostFormSchema = z.object({
  title: z.string().trim().min(1),
  alias: z.string().trim(),
  longTitle: z.string().trim(),
  content: z.string().trim(),
  status: z.nativeEnum(BlogPostStatusEnum),
  imageId: z.number().nullable(),
  tags: z.string().array()
})

export type BlogPostFormFields = z.infer<typeof BlogPostFormSchema>

export function BlogPostForm() {
  const tagsQuery = useSWR<FindAllResult<BlogTagEntity>>([`blog/tag`, { limit: 100 }])
  const form = useFormContext<BlogPostFormFields>()

  return (
    <div className="flex flex-1 flex-col gap-4 md:gap-6">
      <div className="grid grid-cols-2 gap-8">
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
      <div className="grid grid-cols-2 gap-8">
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Статус</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={(value) => field.onChange(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выбрать статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Object.values(BlogPostStatusEnum).map((value) => (
                        <SelectItem value={value} key={value}>
                          {BlogPostStatusLabels[value]}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
      <FormField
        control={form.control}
        name="content"
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
        name="tags"
        render={({ field: { value, onChange } }) => (
          <FormItem>
            <FormLabel>Теги</FormLabel>
            <FormControl>
              <CreateablePicker
                options={(tagsQuery.data?.rows || []).map((item) => ({
                  value: item.name,
                  label: item.name
                }))}
                value={value.map((item) => ({ value: item, label: item }))}
                onChange={(selectedItems) => onChange(selectedItems.map((item) => item.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="p-5 rounded-md flex items-center justify-end gap-4 bg-neutral-50">
        <Link href="/dashboard/blog">
          <Button type="button" variant="outline">
            Отмена
          </Button>
        </Link>
        <Button disabled={form.formState.isSubmitting} type="submit">
          {form.formState.isSubmitting && <ArrowPathIcon className="h-4 w-4 animate-spin" />}
          Сохранить
        </Button>
      </div>
    </div>
  )
}
