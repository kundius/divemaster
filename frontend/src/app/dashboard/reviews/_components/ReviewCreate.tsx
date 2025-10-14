'use client'

import { Form } from '@/components/ui/form'
import { apiPost } from '@/lib/api'
import { ReviewEntity } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ReviewForm, ReviewFormFields, ReviewFormSchema } from './ReviewForm'
import { slugify } from '@/lib/utils'

export function ReviewCreate() {
  const router = useRouter()

  const form = useForm<ReviewFormFields>({
    resolver: zodResolver(ReviewFormSchema),
    defaultValues: {
      advantages: '',
      author: '',
      comment: '',
      flaws: '',
      isPublished: true,
      productId: undefined,
      publishedAt: undefined,
      rating: undefined,
      userId: undefined
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
