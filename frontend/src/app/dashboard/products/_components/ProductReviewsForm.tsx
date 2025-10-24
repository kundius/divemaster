'use client'

import { useRouter } from 'next/navigation'
import { useFormContext } from 'react-hook-form'
import { z } from 'zod'

import { DateInput } from '@/components/ui/date-input'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { ApiInputComboBox } from '@/lib/ApiInputComboBox'
import { ApiInputFiles } from '@/lib/ApiInputFiles'

export const ProductReviewsFormSchema = z.object({
  advantages: z.string().trim().optional(),
  flaws: z.string().trim().optional(),
  comment: z.string().trim().optional(),
  author: z.string().trim().optional(),
  publishedAt: z.date().nullable().optional(),
  userId: z.number().nullable().optional(),
  mediaIds: z.array(z.number()).optional(),
  rating: z.number(),
  isPublished: z.boolean(),
  isRecommended: z.boolean()
})

export type ProductReviewsFormFields = z.infer<typeof ProductReviewsFormSchema>

export function ProductReviewsForm() {
  const router = useRouter()
  const { control, formState } = useFormContext<ProductReviewsFormFields>()
  return (
    <div className="flex flex-1 flex-col gap-4 md:gap-6">
      <div className="grid grid-cols-2 gap-8">
        <FormField
          control={control}
          name="rating"
          render={({ field: { value, onChange } }) => (
            <FormItem>
              <FormLabel>Оценка</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  value={value}
                  onChange={(e) => onChange(Number(e.target.value))}
                  min={1}
                  max={5}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="isRecommended"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Рекомендация</FormLabel>
              <FormControl>
                <div className="h-9 flex items-center">
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
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
          control={control}
          name="isPublished"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Опубликован</FormLabel>
              <FormControl>
                <div className="h-9 flex items-center">
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
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
        <FormField
          control={control}
          name="author"
          render={({ field: { value, onChange } }) => (
            <FormItem>
              <FormLabel>Отображаемое имя</FormLabel>
              <FormControl>
                <Input value={value} onChange={onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="col-span-2">
          <FormField
            control={control}
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
        <div className="col-span-2">
          <FormField
            control={control}
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
        <div className="col-span-2">
          <FormField
            control={control}
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
        <div className="col-span-2">
          <FormField
            control={control}
            name="mediaIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Файлы</FormLabel>
                <FormControl>
                  <ApiInputFiles
                    value={field.value}
                    onChange={field.onChange}
                    allowedTypes={['image/jpeg', 'image/png', 'video/mp4']}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  )
}
