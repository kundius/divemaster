'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { OptionType } from '@/types'
import Link from 'next/link'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

export const OptionFormSchema = z.object({
  key: z.string().trim().min(1),
  rank: z.coerce.number(),
  caption: z.string().trim().min(1),
  inFilter: z.boolean(),
  inCart: z.boolean(),
  type: z.nativeEnum(OptionType).default(OptionType.VARIANT)
})

export type OptionFormFields = z.infer<typeof OptionFormSchema>

export interface OptionFormProps {
  form: UseFormReturn<OptionFormFields, any, undefined>
  onSubmit: (values: OptionFormFields) => Promise<void>
}

export function OptionForm({ form, onSubmit }: OptionFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-6">
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
                          <SelectItem value={OptionType.VARIANT}>Список с автодополнением</SelectItem>
                          <SelectItem value={OptionType.COLOR}>Цвет</SelectItem>
                          <SelectItem value={OptionType.SIZE}>Размер</SelectItem>
                          <SelectItem value={OptionType.TEXT}>Текстовое поле</SelectItem>
                          <SelectItem value={OptionType.NUMBER}>Числовое поле</SelectItem>
                          <SelectItem value={OptionType.BOOLEAN}>Да/Нет</SelectItem>
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
                name="inCart"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Корзина</FormLabel>
                    <FormControl>
                      <div className="w-full">
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </div>
                    </FormControl>
                    <FormDescription>Показывать при добавлении в корзину</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
            <Link href="/admin/options">
              <Button type="button" variant="outline">
                Отмена
              </Button>
            </Link>
            <Button loading={form.formState.isSubmitting} type="submit">
              Сохранить
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
