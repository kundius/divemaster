'use client'

import { Form } from '@/components/ui/form'
import { apiPatch } from '@/lib/api'
import { slugify } from '@/lib/utils'
import { BlogPostEntity } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { BlogPostForm, BlogPostFormFields, BlogPostFormSchema } from './BlogPostForm'

export interface BlogPostUpdateProps {
  record: BlogPostEntity
}

export function BlogPostUpdate({ record }: BlogPostUpdateProps) {
  const form = useForm<BlogPostFormFields>({
    resolver: zodResolver(BlogPostFormSchema),
    defaultValues: {
      status: record.status,
      longTitle: record.longTitle || '',
      content: record.content || '',
      alias: record.alias,
      title: record.title,
      imageId: record.image?.id || null,
      tags: record.tags.map((blogTag) => blogTag?.name)
    }
  })

  const onSubmit = async (values: BlogPostFormFields) => {
    values.alias = slugify(values.alias || values.title)
    form.setValue('alias', values.alias)

    try {
      await apiPatch(`blog/post/${record.id}`, values)
      toast.success('Пост изменен')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Unknown error')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <BlogPostForm />
      </form>
    </Form>
  )
}
