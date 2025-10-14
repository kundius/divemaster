'use client'

import { Button } from '@/components/ui/button'
import { DateInput } from '@/components/ui/date-input'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { ApiInputComboBox } from '@/lib/ApiInputComboBox'
import { ApiInputFile } from '@/lib/ApiInputFile'
import { EditorInput } from '@/lib/EditorInput'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useFormContext } from 'react-hook-form'
import { z } from 'zod'

export const ReviewFormSchema = z.object({
  advantages: z.string().trim().nullable(),
  flaws: z.string().trim().nullable(),
  comment: z.string().trim().nullable(),
  author: z.string().trim().nullable(),
  publishedAt: z.date().nullable(),
  userId: z.number().nullable(),
  productId: z.number(),
  rating: z.number(),
  isPublished: z.boolean()
})

export type ReviewFormFields = z.infer<typeof ReviewFormSchema>

export function ReviewForm() {
  const router = useRouter()
  const { control, formState } = useFormContext<ReviewFormFields>()
  return (
    <div className="flex flex-1 flex-col gap-4 md:gap-6">
      {/* <div className="flex gap-6">
        <div className="w-1/2">
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Название</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="w-1/2">
          <FormField
            control={control}
            name="alias"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Псевдоним</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      <div className="flex gap-6">
        <div className="w-1/2">
          <FormField
            control={control}
            name="imageId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Изображение</FormLabel>
                <FormControl>
                  <ApiInputFile
                    value={field.value}
                    onChange={field.onChange}
                    allowedTypes={['image/jpeg', 'image/png']}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div> */}
      <FormField
        control={control}
        name="publishedAt"
        render={({ field }) => (
          <FormItem>
            <FormLabel>publishedAt</FormLabel>
            <FormControl>
              <DateInput value={field.value} onChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="productId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>productId</FormLabel>
            <FormControl>
              <ApiInputComboBox url="products" value={field.value} onChange={field.onChange} />
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
            <FormLabel>userId</FormLabel>
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
        name="rating"
        render={({ field: { value, onChange } }) => (
          <FormItem>
            <FormLabel>rating</FormLabel>
            <FormControl>
              <Input type="number" value={value || ''} onChange={onChange} />
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
            <FormLabel>author</FormLabel>
            <FormControl>
              <Input value={value || ''} onChange={onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="advantages"
        render={({ field: { value, onChange } }) => (
          <FormItem>
            <FormLabel>advantages</FormLabel>
            <FormControl>
              <Textarea value={value || ''} onChange={onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="comment"
        render={({ field: { value, onChange } }) => (
          <FormItem>
            <FormLabel>comment</FormLabel>
            <FormControl>
              <Textarea value={value || ''} onChange={onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="flaws"
        render={({ field: { value, onChange } }) => (
          <FormItem>
            <FormLabel>flaws</FormLabel>
            <FormControl>
              <Textarea value={value || ''} onChange={onChange} />
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
            <FormLabel>Активна</FormLabel>
            <FormControl>
              <div className="w-full">
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="p-5 rounded-md flex items-center justify-end gap-4 bg-neutral-50">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Отмена
        </Button>
        <Button disabled={formState.isSubmitting} type="submit">
          {formState.isSubmitting && <ArrowPathIcon className="h-4 w-4 animate-spin" />}
          Сохранить
        </Button>
      </div>
    </div>
  )
}
