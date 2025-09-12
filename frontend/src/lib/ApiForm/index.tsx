'use client'

import { api } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { FieldValues, UseFormProps, UseFormReturn, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

interface ApiFormProps<TFieldValues extends FieldValues = FieldValues, TResult = unknown> {
  url: string
  method: string
  successMessage?: string
  schema: z.Schema
  defaultValues: UseFormProps<TFieldValues, any>['defaultValues']
  redirect?: 'form' | 'table' | 'back' | false
  mapValues?: (values: TFieldValues) => Promise<TFieldValues> | TFieldValues
  onSuccess?: (data: TResult) => Promise<void> | void
}

export function useApiForm<TFieldValues extends FieldValues = FieldValues, TResult = unknown>({
  defaultValues,
  schema,
  successMessage = 'Сохранено',
  url,
  method,
  mapValues,
  onSuccess
}: ApiFormProps<TFieldValues, TResult>): [
  UseFormReturn<TFieldValues, any, TFieldValues>,
  (values: TFieldValues) => Promise<void>
] {
  const form = useForm<TFieldValues>({
    resolver: zodResolver(schema),
    defaultValues
  })

  const onSubmit = async (values: TFieldValues) => {
    if (mapValues) {
      values = await mapValues(values)
    }

    try {
      const data = await api<TResult>(method, url, values)

      toast.success(successMessage)

      if (onSuccess) {
        await onSuccess(data)
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Unknown error')
    }
  }

  return [form, onSubmit]
}
