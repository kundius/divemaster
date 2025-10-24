'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { Spinner } from '@/components/ui/spinner'
import { apiPatch } from '@/lib/api'
import { ReviewEntity } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToggle } from '@reactuses/core'
import { parseISO } from 'date-fns'
import { PropsWithChildren } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
  ProductReviewsForm,
  ProductReviewsFormFields,
  ProductReviewsFormSchema
} from './ProductReviewsForm'

export interface ProductReviewsUpdateDialogProps {
  productId: number
  record: ReviewEntity
  onSuccess?: (record: ReviewEntity) => void
}

export function ProductReviewsUpdateDialog({
  productId,
  record,
  children,
  onSuccess
}: PropsWithChildren<ProductReviewsUpdateDialogProps>) {
  const [show, toggleShow] = useToggle(false)

  const form = useForm<ProductReviewsFormFields>({
    resolver: zodResolver(ProductReviewsFormSchema),
    defaultValues: {
      advantages: record.advantages || undefined,
      author: record.author || undefined,
      comment: record.comment || undefined,
      flaws: record.flaws || undefined,
      isPublished: record.isPublished,
      isRecommended: record.isRecommended,
      publishedAt:
        typeof record.publishedAt === 'string' ? parseISO(record.publishedAt) : record.publishedAt,
      rating: record.rating,
      userId: record.userId,
      mediaIds: record.media?.map((media) => media.fileId) || []
    }
  })

  const onSubmit = async (values: ProductReviewsFormFields) => {
    try {
      const result = await apiPatch<ReviewEntity>(`reviews/${record.id}`, { ...values, productId })
      toast.success('Отзыв изменен')
      toggleShow()
      onSuccess?.(result)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Unknown error')
    }
  }

  const submitHandler = form.handleSubmit(onSubmit)

  return (
    <Dialog open={show} onOpenChange={toggleShow}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Редактировать отзыв</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={submitHandler}>
            <ProductReviewsForm />
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Отмена
            </Button>
          </DialogClose>
          <Button disabled={form.formState.isSubmitting} type="button" onClick={submitHandler}>
            {form.formState.isSubmitting && <Spinner className="size-4" />}
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
