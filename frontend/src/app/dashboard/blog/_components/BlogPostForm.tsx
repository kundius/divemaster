'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

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
import { apiPatch, apiPost } from '@/lib/api'
import { withClientAuth } from '@/lib/api/with-client-auth'
import { slugify } from '@/lib/utils'
import { BlogPostEntity, BlogPostStatusEnum, BlogTagEntity, FindAllResult } from '@/types'
import { ApiInputFile } from '@/lib/ApiInputFile'
import { EditorInput } from '@/lib/EditorInput'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { BlogPostStatusLabels } from '../data'
import { CreateablePicker } from '@/components/ui/createable-picker'
import useSWR from 'swr'

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

export interface BlogPostFormProps {
  record?: BlogPostEntity
}

export function BlogPostForm({ record }: BlogPostFormProps) {
  const tagsQuery = useSWR<FindAllResult<BlogTagEntity>>([`blog/tag`, { limit: 100 }])

  const router = useRouter()

  const form = useForm<BlogPostFormFields>({
    resolver: zodResolver(BlogPostFormSchema),
    defaultValues: record
      ? {
          status: record.status,
          longTitle: record.longTitle || '',
          content: record.content || '',
          alias: record.alias,
          title: record.title,
          imageId: record.image?.id || null,
          tags: record.tags.map((item) => item.name)
        }
      : {
          status: BlogPostStatusEnum.Draft,
          longTitle: '',
          content: '',
          alias: '',
          imageId: null,
          tags: []
        }
  })

  const onSubmit = async (values: BlogPostFormFields) => {
    values.alias = slugify(values.alias || values.title)
    form.setValue('alias', values.alias)

    if (record) {
      update(values)
    } else {
      create(values)
    }
  }

  const update = async (values: BlogPostFormFields) => {
    if (!record) {
      throw new Error('record not defined')
    }

    try {
      await apiPatch(`blog/post/${record.id}`, values, withClientAuth())

      toast.success('Пост изменен')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Unknown error')
    }
  }

  const create = async (values: BlogPostFormFields) => {
    try {
      const result = await apiPost<BlogPostEntity>(`blog/post`, values, withClientAuth())

      toast.success('Пост добавлен')

      router.push(`/dashboard/blog/${result.id}`)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Unknown error')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
            {form.formState.isSubmitting && <ButtonLoadingIcon />}
            Сохранить
          </Button>
        </div>
      </form>
    </Form>
  )
}
