'use client'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ApiInputFile } from '@/lib/ApiInputFile'
import { EditorInput } from '@/lib/EditorInput'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useFormContext } from 'react-hook-form'
import { z } from 'zod'

export const BrandFormSchema = z.object({
  name: z.string().trim().min(1),
  alias: z.string().trim(),
  description: z.string().trim().nullable(),
  imageId: z.number().nullable()
})

export type BrandFormFields = z.infer<typeof BrandFormSchema>

export function BrandForm() {
  const router = useRouter()
  const { control, formState } = useFormContext<BrandFormFields>()
  return (
    <div className="flex flex-1 flex-col gap-4 md:gap-6">
      <div className="flex gap-6">
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
      </div>
      <FormField
        control={control}
        name="description"
        render={({ field: { value, onChange } }) => (
          <FormItem>
            <FormLabel>Описание</FormLabel>
            <FormControl>
              <EditorInput value={value || ''} onChange={onChange} />
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
