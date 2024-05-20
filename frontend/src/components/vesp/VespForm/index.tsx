'use client'

import { api } from '@/lib/api'
import { withToken } from '@/lib/api/with-token'
import { useAuth } from '@/lib/auth/use-auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { PropsWithChildren } from 'react'
import { DefaultValues, FieldValues, UseFormReturn, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

interface VespFormProps<TFieldValues extends FieldValues = FieldValues, TResult = unknown> {
  url: string
  method: string
  successMessage?: string
  schema: z.Schema
  defaultValues: DefaultValues<TFieldValues>
  redirect?: 'form' | 'table' | 'back' | false
  mapValues?: (values: TFieldValues) => Promise<TFieldValues> | TFieldValues
  onSuccess?: (data: TResult) => Promise<void> | void
}

export function useVespForm<TFieldValues extends FieldValues = FieldValues, TResult = unknown>({
  defaultValues,
  children,
  schema,
  successMessage = 'Сохранено',
  url,
  method,
  mapValues,
  onSuccess
}: PropsWithChildren<VespFormProps<TFieldValues, TResult>>): [
  UseFormReturn<TFieldValues, any, undefined>,
  (values: TFieldValues) => Promise<void>
] {
  const auth = useAuth()
  // const router = useRouter()

  const form = useForm<TFieldValues>({
    resolver: zodResolver(schema),
    defaultValues
  })

  const onSubmit = async (values: TFieldValues) => {
    if (mapValues) {
      values = await mapValues(values)
    }

    try {
      const data = await api<TResult>(url, {
        ...withToken(auth.token)(),
        method,
        body: JSON.stringify(values)
      })

      toast.success(successMessage)

      if (onSuccess) {
        await onSuccess(data)
      }
      // switch (redirect) {
      //   case 'form':
      //     router.push(`/${url}/${(data as any).id}`)
      //     break
      //   case 'table':
      //     router.push(`/${url}`)
      //     break
      //   case 'back':
      //     router.back()
      //     break
      // }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Unknown error')
    }
  }

  return [form, onSubmit]
}
