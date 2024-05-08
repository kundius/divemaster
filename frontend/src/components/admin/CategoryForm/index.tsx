'use client'

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useFormContext } from 'react-hook-form'
import { z } from 'zod'

export const CategoryFormSchema = z.object({
  title: z.string().trim().min(1),
  alias: z.string().trim().min(1),
  description: z.string().trim(),
  active: z.boolean()
})

export type CategoryFormFields = z.infer<typeof CategoryFormSchema>

export function CategoryForm() {
  const { control } = useFormContext<CategoryFormFields>()
  return (
    <div className="space-y-6">
      <div className="flex gap-6">
        <div className="w-2/3">
          <FormField
            control={control}
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
        <div className="w-1/3">
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
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Описание</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="active"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Активен</FormLabel>
            <FormControl>
              <div className="w-full">
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
