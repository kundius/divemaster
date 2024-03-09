'use client'

import { Form } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePathname, useRouter } from 'next/navigation'
import { PropsWithChildren } from 'react'
import { FieldValues, UseFormProps, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

interface VespFormProps<TFieldValues extends FieldValues = FieldValues, TResult = unknown>
  extends UseFormProps<TFieldValues> {
  action: (values: TFieldValues) => Promise<TResult>
  schema: z.Schema
}

export function VespForm<TFieldValues extends FieldValues = FieldValues, TResult = unknown>({
  defaultValues,
  children,
  schema,
  action
}: PropsWithChildren<VespFormProps<TFieldValues, TResult>>) {
  const router = useRouter()
  const pathname = usePathname()

  const form = useForm<TFieldValues>({
    resolver: zodResolver(schema),
    defaultValues
  })

  const onSubmit = async (values: TFieldValues) => {
    try {
      const data = await action(values)

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
