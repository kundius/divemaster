'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

export const BrandFormSchema = z.object({
  title: z.string().trim().min(1)
})

export type BrandFormFields = z.infer<typeof BrandFormSchema>

export interface BrandFormProps {
  form: UseFormReturn<BrandFormFields, any, undefined>
  onSubmit: (values: BrandFormFields) => Promise<void>
}

export function BrandForm({ form, onSubmit }: BrandFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <div className="flex gap-6">
            <div className="w-2/3">
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
            </div>
          </div>
          <Button disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting && <ArrowPathIcon className="h-4 w-4 animate-spin" />}
            Сохранить
          </Button>
        </div>
      </form>
    </Form>
  )
}
