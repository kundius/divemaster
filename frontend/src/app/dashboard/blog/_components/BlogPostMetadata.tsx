'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import useSWR from 'swr'
import { z } from 'zod'

import { Button, ButtonLoadingIcon } from '@/components/ui/button'
import { CreateablePicker } from '@/components/ui/createable-picker'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
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
import { apiPatch, apiPost } from '@/lib/api'
import { slugify } from '@/lib/utils'
import { BlogPostEntity, BlogPostStatusEnum, BlogTagEntity, FindAllResult } from '@/types'
import { Textarea } from '@/components/ui/textarea'

import { BlogPostStatusLabels } from '../data'

export const BlogPostMetadataSchema = z.object({
  title: z.string().trim(),
  keywords: z.string().trim(),
  description: z.string().trim()
})

export type BlogPostMetadataFields = z.infer<typeof BlogPostMetadataSchema>

export interface BlogPostMetadataProps {
  record?: BlogPostEntity
}

export function BlogPostMetadata({ record }: BlogPostMetadataProps) {
  const form = useForm<BlogPostMetadataFields>({
    resolver: zodResolver(BlogPostMetadataSchema),
    defaultValues: record
      ? {
          title: record.metadata?.title || '',
          keywords: record.metadata?.keywords || '',
          description: record.metadata?.description || ''
        }
      : {
          title: '',
          keywords: '',
          description: ''
        }
  })

  const onSubmit = async (metadata: BlogPostMetadataFields) => {
    if (!record) {
      throw new Error('record not defined')
    }

    try {
      await apiPatch(`blog/post/${record.id}`, { metadata })

      toast.success('Метаданные изменены')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Unknown error')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
          name="keywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ключевые слова</FormLabel>
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
