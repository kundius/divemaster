'use client'

import { TrashIcon } from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import { parseISO } from 'date-fns'
import { PropsWithChildren, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { apiPatch, apiPost } from '@/lib/api'
import { ApiInputComboBox } from '@/lib/ApiInputComboBox'
import { ApiRemoveDialog } from '@/lib/ApiRemoveDialog'
import { ReviewEntity, ReviewReplyEntity } from '@/types'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { ApiInputFiles } from '@/lib/ApiInputFiles'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useAuthStore } from '@/providers/auth-store-provider'

export interface AddDialogProps {
  productId: number
  onSuccess?: (data: ReviewEntity) => void
}

export interface AddDialogFormFields {
  advantages: string
  flaws: string
  comment: string
  author?: string
  mediaIds: number[]
  rating: number
  isRecommended: boolean
}

export function AddDialog({ productId, children, onSuccess }: PropsWithChildren<AddDialogProps>) {
  const user = useAuthStore((store) => store.user)

  const [open, setOpen] = useState(false)

  const form = useForm<AddDialogFormFields>({
    defaultValues: {
      isRecommended: true,
      rating: 5,
      advantages: '',
      flaws: '',
      comment: '',
      mediaIds: []
    }
  })

  const onSubmit = async (values: AddDialogFormFields) => {
    if (!values.advantages.trim() && !values.flaws.trim() && !values.comment.trim()) {
      toast.warning(
        'Напишите, пожалуйста, хотя бы несколько слов о товаре. Отзывы без описания не публикуются.'
      )
      return
    }
    try {
      const result = await apiPost<ReviewEntity>(`reviews/add`, {
        ...values,
        productId
      })
      toast.success('Спасибо за ваш отзыв! Нам очень важно ваше мнение.')
      setOpen(false)
      onSuccess?.(result)
      form.reset()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Unknown error')
    }
  }

  const submitHandler = form.handleSubmit(onSubmit)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[770px]">
        <DialogHeader>
          <DialogTitle>Добавить отзыв</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={submitHandler}>
            <div className="flex flex-wrap gap-8 items-end">
              {!user && (
                <div>
                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field: { value, onChange } }) => (
                      <FormItem>
                        <FormLabel>Ваше имя</FormLabel>
                        <FormControl>
                          <Input value={value} onChange={onChange} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              <div>
                <FormField
                  control={form.control}
                  name="rating"
                  rules={{
                    required: 'Ваша оценка'
                  }}
                  render={({ field: { value, onChange } }) => (
                    <FormItem>
                      <FormLabel>Ваша оценка</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <ToggleGroup
                            type="single"
                            value={String(value)}
                            onValueChange={(v) => v && onChange(Number(v))}
                            variant="outline"
                          >
                            <ToggleGroupItem value="1">1</ToggleGroupItem>
                            <ToggleGroupItem value="2">2</ToggleGroupItem>
                            <ToggleGroupItem value="3">3</ToggleGroupItem>
                            <ToggleGroupItem value="4">4</ToggleGroupItem>
                            <ToggleGroupItem value="5">5</ToggleGroupItem>
                          </ToggleGroup>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="isRecommended"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center gap-3 min-h-9">
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          <Label htmlFor="terms">Рекомендовать товар</Label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="advantages"
                  render={({ field: { value, onChange } }) => (
                    <FormItem>
                      <FormLabel>Достоинства</FormLabel>
                      <FormControl>
                        <Textarea value={value} onChange={onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="flaws"
                  render={({ field: { value, onChange } }) => (
                    <FormItem>
                      <FormLabel>Недостатки</FormLabel>
                      <FormControl>
                        <Textarea value={value} onChange={onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full">
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
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="mediaIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Прикрепить файлы</FormLabel>
                      <FormControl>
                        <ApiInputFiles
                          value={field.value}
                          onChange={field.onChange}
                          allowedTypes={['image/jpeg', 'image/png', 'video/mp4']}
                        />
                      </FormControl>
                      <FormDescription>
                        Вы можете загрузить изображения (JPEG, PNG) или видео (MP4)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
        <DialogFooter>
          <div className="grow" />
          <DialogClose asChild>
            <Button variant="ghost" type="button">
              Отмена
            </Button>
          </DialogClose>
          <Button type="button" onClick={submitHandler}>
            Отправить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
