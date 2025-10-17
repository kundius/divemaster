'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Form } from '@/components/ui/form'
import { apiPost } from '@/lib/api'
import { ReviewEntity } from '@/types'
import { ReviewForm, ReviewFormFields, ReviewFormSchema } from './ReviewForm'

export function ReviewCreate() {
  const router = useRouter()

  const form = useForm<ReviewFormFields>({
    resolver: zodResolver(ReviewFormSchema),
    defaultValues: {
      isPublished: true,
      isRecommended: true,
      publishedAt: new Date(),
      rating: 5,
      mediaIds: []
    }
  })

  const onSubmit = async (values: ReviewFormFields) => {
    try {
      const result = await apiPost<ReviewEntity>(`reviews`, values)
      toast.success('Отзыв добавлен')
      router.push(`/dashboard/reviews/${result.id}`)
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
