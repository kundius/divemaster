'use client'

import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { PropertyType } from '@/types'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useFormContext } from 'react-hook-form'
import { z } from 'zod'

export const PropertyFormSchema = z.object({
  key: z.string().trim().min(1),
  rank: z.coerce.number(),
  caption: z.string().trim().min(1),
  inFilter: z.boolean(),
  type: z.nativeEnum(PropertyType).default(PropertyType.TEXTFIELD)
})

export type PropertyFormFields = z.infer<typeof PropertyFormSchema>

export function PropertyForm() {
  const form = useFormContext<PropertyFormFields>()

  return (
    <div className="flex flex-1 flex-col gap-4 md:gap-6">
      <div className="flex gap-6">
        <div className="w-1/2">
          <FormField
            control={form.control}
            name="caption"
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
            control={form.control}
            name="key"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ключ</FormLabel>
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
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Тип</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Выберите тип" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={PropertyType.COMBOBOOLEAN}>Да/Нет</SelectItem>
                      <SelectItem value={PropertyType.COMBOCOLORS}>Список с цветами</SelectItem>
                      <SelectItem value={PropertyType.COMBOOPTIONS}>
                        Список с автодополнением
                      </SelectItem>
                      <SelectItem value={PropertyType.NUMBERFIELD}>Числовое поле</SelectItem>
                      <SelectItem value={PropertyType.TEXTFIELD}>Текстовое поле</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="w-1/2">
          <FormField
            control={form.control}
            name="rank"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Порядок</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
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
            control={form.control}
            name="inFilter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Фильтр</FormLabel>
                <FormControl>
                  <div className="w-full">
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </div>
                </FormControl>
                <FormDescription>Показывать при фильтрации</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      <div className="p-5 rounded-md flex items-center justify-end gap-4 bg-neutral-50">
        <Link href="/dashboard/properties">
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
