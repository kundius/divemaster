'use client'

import { TrashIcon } from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import { parseISO } from 'date-fns'
import { PropsWithChildren, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { DateInput } from '@/components/ui/date-input'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { apiPatch, apiPost } from '@/lib/api'
import { ApiInputComboBox } from '@/lib/ApiInputComboBox'
import { ApiRemoveDialog } from '@/lib/ApiRemoveDialog'
import { ReviewReplyEntity } from '@/types'

export interface ReviewReplyDialogProps {
  initialData?: ReviewReplyEntity | null
  reviewId: number
  onChange?: (data: ReviewReplyEntity | null) => void
}

export const ReviewReplyFormSchema = z.object({
  comment: z.string().trim(),
  publishedAt: z.date().nullable().optional(),
  userId: z.number().nullable().optional()
})

export type ReviewReplyFormFields = z.infer<typeof ReviewReplyFormSchema>

export function ReviewReplyDialog({
  initialData,
  reviewId,
  children,
  onChange
}: PropsWithChildren<ReviewReplyDialogProps>) {
  const [open, setOpen] = useState(false)
  const [data, setData] = useState(initialData ?? null)

  const form = useForm<ReviewReplyFormFields>({
    resolver: zodResolver(ReviewReplyFormSchema),
    defaultValues: {
      comment: data ? data.comment : undefined,
      publishedAt: data ? parseISO(data.publishedAt) : undefined,
      userId: data ? data.userId : undefined
    }
  })

  const onSubmit = async (values: ReviewReplyFormFields) => {
    try {
      let response: ReviewReplyEntity
      if (data) {
        response = await apiPatch<ReviewReplyEntity>(`reviews/${reviewId}/reply`, values)
      } else {
        response = await apiPost<ReviewReplyEntity>(`reviews/${reviewId}/reply`, values)
      }
      setOpen(false)
      setData(response)
      onChange?.(response)
      form.reset({
        comment: response.comment,
        publishedAt: parseISO(response.publishedAt),
        userId: response.userId
      })
      toast.success('Ответ изменен')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Unknown error')
    }
  }

  const onRemove = () => {
    setOpen(false)
    setData(null)
    onChange?.(null)
    form.reset({
      comment: '',
      publishedAt: null,
      userId: null
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Ответ</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="publishedAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Дата публикации</FormLabel>
                    <FormControl>
                      <DateInput value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Автор</FormLabel>
                    <FormControl>
                      <ApiInputComboBox
                        displayField="name"
                        url="users"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field: { value, onChange } }) => (
                    <FormItem>
                      <FormLabel>Комментарий</FormLabel>
                      <FormControl>
                        <Textarea value={value} onChange={onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              {data && (
                <ApiRemoveDialog url={`reviews/${reviewId}/reply`} onSuccess={onRemove}>
                  <Button variant="outline" className="text-destructive hover:text-destructive">
                    <TrashIcon className="w-4 h-4" /> Удалить
                  </Button>
                </ApiRemoveDialog>
              )}
              <div className="grow" />
              <DialogClose asChild>
                <Button variant="ghost" type="button">
                  Отмена
                </Button>
              </DialogClose>
              <Button type="submit">Сохранить</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
