'use client'

import { Form } from '@/components/ui/form'
import { apiPatch } from '@/lib/api'
import { ReviewEntity } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ReviewForm, ReviewFormFields, ReviewFormSchema } from './ReviewForm'
import slugify from 'slugify'

export interface ReviewUpdateProps {
  record: ReviewEntity
}

export function ReviewUpdate({ record }: ReviewUpdateProps) {
  const form = useForm<ReviewFormFields>({
    resolver: zodResolver(ReviewFormSchema),
    defaultValues: {
      // imageId: record.imageId,
      // description: record.description || '',
      // name: record.name,
      // alias: record.alias
    }
  })

  const onSubmit = async (values: ReviewFormFields) => {
    values.alias = slugify(values.alias || values.name)
    form.setValue('alias', values.alias)

    try {
      await apiPatch(`reviews/${record.id}`, values)
      toast.success('Бренд изменен')
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
