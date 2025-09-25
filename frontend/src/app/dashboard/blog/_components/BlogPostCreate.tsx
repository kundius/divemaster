'use client'

import { Form } from '@/components/ui/form'
import { apiPost } from '@/lib/api'
import { slugify } from '@/lib/utils'
import { BlogPostEntity, BlogPostStatusEnum } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { BlogPostForm, BlogPostFormFields, BlogPostFormSchema } from './BlogPostForm'

export function BlogPostCreate() {
  const router = useRouter()

  const form = useForm<BlogPostFormFields>({
    resolver: zodResolver(BlogPostFormSchema),
    defaultValues: {
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

    try {
      const result = await apiPost<BlogPostEntity>(`blog/post`, values)
      toast.success('Пост добавлен')
      router.push(`/dashboard/blog/${result.id}`)
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
