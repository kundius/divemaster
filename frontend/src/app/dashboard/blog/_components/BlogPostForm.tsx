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
import { Switch } from '@/components/ui/switch'
import { apiPatch, apiPost } from '@/lib/api'
import { withClientAuth } from '@/lib/api/with-client-auth'
import { slugify } from '@/lib/utils'
import { BlogPostEntity } from '@/types'

import { revalidate } from '../actions'

export const BlogPostFormSchema = z.object({
  title: z.string().trim().min(1),
  alias: z.string().trim(),
  longTitle: z.string().trim(),
  active: z.boolean()
})

export type BlogPostFormFields = z.infer<typeof BlogPostFormSchema>

export interface BlogPostFormProps {
  record?: BlogPostEntity
}

export function BlogPostForm({ record }: BlogPostFormProps) {
  const router = useRouter()

  const form = useForm<BlogPostFormFields>({
    resolver: zodResolver(BlogPostFormSchema),
    defaultValues: record
      ? {
          active: record.active,
          longTitle: record.longTitle || '',
          alias: record.alias,
          title: record.title
        }
      : {
          active: true,
          longTitle: '',
          alias: ''
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

      revalidate()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Unknown error')
    }
  }

  const create = async (values: BlogPostFormFields) => {
    try {
      const result = await apiPost<BlogPostEntity>(`blog/post`, values, withClientAuth())

      toast.success('Пост добавлен')

      router.push(`/dashboard/blog/${result.id}`)

      revalidate()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Unknown error')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
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
        <div className="grid grid-cols-4 gap-6">
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
        </div>
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
