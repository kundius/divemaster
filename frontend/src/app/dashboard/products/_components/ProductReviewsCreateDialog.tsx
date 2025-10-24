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
import { apiPost } from '@/lib/api'
import { ReviewEntity } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToggle } from '@reactuses/core'
import { PropsWithChildren } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
  ProductReviewsForm,
  ProductReviewsFormFields,
  ProductReviewsFormSchema
} from './ProductReviewsForm'

export interface ProductReviewsCreateDialogProps {
  productId: number
  onSuccess?: (record: ReviewEntity) => void
}

export function ProductReviewsCreateDialog({
  productId,
  children,
  onSuccess
}: PropsWithChildren<ProductReviewsCreateDialogProps>) {
  const [show, toggleShow] = useToggle(false)

  const form = useForm<ProductReviewsFormFields>({
    resolver: zodResolver(ProductReviewsFormSchema),
    defaultValues: {
      isPublished: true,
      isRecommended: true,
      publishedAt: new Date(),
      rating: 5,
      mediaIds: []
    }
  })

  const onSubmit = async (values: ProductReviewsFormFields) => {
    try {
      const result = await apiPost<ReviewEntity>(`reviews`, { ...values, productId })
      toast.success('Отзыв добавлен')
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
          <DialogTitle>Добавить отзыв</DialogTitle>
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
