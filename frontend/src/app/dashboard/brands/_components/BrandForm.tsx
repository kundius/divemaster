'use client'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useFormContext } from 'react-hook-form'
import { z } from 'zod'

export const BrandFormSchema = z.object({
  title: z.string().trim().min(1)
})

export type BrandFormFields = z.infer<typeof BrandFormSchema>

export function BrandForm() {
  const form = useFormContext<BrandFormFields>()

  return (
    <div className="flex flex-1 flex-col gap-4 md:gap-6">
      <FormField
        control={form.control}
        name="title"
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
      <div className="p-5 rounded-md flex items-center justify-end gap-4 bg-neutral-50">
        <Link href="/dashboard/brands">
          <Button type="button" variant="outline">
            Отмена
          </Button>
        </Link>
        <Button disabled={form.formState.isSubmitting} type="submit">
          {form.formState.isSubmitting && <ArrowPathIcon className="h-4 w-4 animate-spin" />}
          Сохранить
        </Button>
      </div>
    </div>
  )
}
