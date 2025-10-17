'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { parseISO } from 'date-fns'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Form } from '@/components/ui/form'
import { apiPatch } from '@/lib/api'
import { ReviewEntity } from '@/types'
import { ReviewForm, ReviewFormFields, ReviewFormSchema } from './ReviewForm'

export interface ReviewUpdateProps {
  record: ReviewEntity
}

export function ReviewUpdate({ record }: ReviewUpdateProps) {
  const form = useForm<ReviewFormFields>({
    resolver: zodResolver(ReviewFormSchema),
    defaultValues: {
      advantages: record.advantages || undefined,
      author: record.author || undefined,
      comment: record.comment || undefined,
      flaws: record.flaws || undefined,
      isPublished: record.isPublished,
      isRecommended: record.isRecommended,
      productId: record.productId,
      publishedAt:
        typeof record.publishedAt === 'string' ? parseISO(record.publishedAt) : record.publishedAt,
      rating: record.rating,
      userId: record.userId,
      mediaIds: record.media?.map((media) => media.fileId) || []
    }
  })

  const onSubmit = async (values: ReviewFormFields) => {
    try {
      await apiPatch(`reviews/${record.id}`, values)
      toast.success('Отзыв изменен')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Unknown error')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <ReviewForm />
      </form>
    </Form>
  )
}
