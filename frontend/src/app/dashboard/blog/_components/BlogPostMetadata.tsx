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
import { Textarea } from '@/components/ui/textarea'
import { apiPatch } from '@/lib/api'
import { BlogPostEntity } from '@/types'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

export const BlogPostMetadataSchema = z.object({
  title: z.string().trim(),
  keywords: z.string().trim(),
  description: z.string().trim()
})

export type BlogPostMetadataFields = z.infer<typeof BlogPostMetadataSchema>

export interface BlogPostMetadataProps {
  record: BlogPostEntity
}

export function BlogPostMetadata({ record }: BlogPostMetadataProps) {
  const form = useForm<BlogPostMetadataFields>({
    resolver: zodResolver(BlogPostMetadataSchema),
    defaultValues: {
      title: record.metadata?.title || '',
      keywords: record.metadata?.keywords || '',
      description: record.metadata?.description || ''
    }
  })

  const onSubmit = async (metadata: BlogPostMetadataFields) => {
    try {
      await apiPatch(`blog/post/${record.id}`, { metadata })

      toast.success('Метаданные изменены')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Unknown error')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-1 flex-col gap-4 md:gap-6">
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
              {form.formState.isSubmitting && <ArrowPathIcon className="h-4 w-4 animate-spin" />}
              Сохранить
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
