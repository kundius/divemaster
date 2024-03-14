'use client'

import { Form } from '@/components/ui/form'
import { api } from '@/lib/api'
import { withToken } from '@/lib/api/with-token'
import { useAuth } from '@/lib/auth/use-auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePathname, useRouter } from 'next/navigation'
import { PropsWithChildren } from 'react'
import { DefaultValues, FieldValues, UseFormProps, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

interface VespFormProps<TFieldValues extends FieldValues = FieldValues> {
  url: string
  method: string
  schema: z.Schema
  defaultValues?: DefaultValues<TFieldValues>
}

export function VespForm<TFieldValues extends FieldValues = FieldValues, TResult = unknown>({
  defaultValues,
  children,
  schema,
  url,
  method
}: PropsWithChildren<VespFormProps<TFieldValues>>) {
  const auth = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const form = useForm<TFieldValues>({
    resolver: zodResolver(schema),
    defaultValues
  })

  const onSubmit = async (values: TFieldValues) => {
    try {
      const data = await api<TResult>(url, {
        ...withToken(auth.token)(),
        method,
        body: JSON.stringify(values)
      })

      toast.success(`Сохранено`)

      if (data && typeof data === 'object' && 'id' in data) {
        if (pathname.endsWith('create')) {
          router.push(pathname.replace('create', String(data.id)))
        }
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Unknown error')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>{children}</form>
    </Form>
  )
}
