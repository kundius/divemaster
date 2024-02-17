'use client'

import { Form } from '@/components/ui/form'
import { useRouter } from 'next/navigation'
import { PropsWithChildren, useState } from 'react'
import { FieldValues, UseFormProps, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { PageHeader, PageHeaderProps } from '../PageHeader'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

interface FormPageProps<TFieldValues extends FieldValues = FieldValues, TResult = unknown>
  extends UseFormProps<TFieldValues> {
  title: string
  sectionPath: string
  action: (values: TFieldValues) => Promise<TResult>
  schema: z.Schema
}

export function FormPage<TFieldValues extends FieldValues = FieldValues, TResult = unknown>({
  defaultValues,
  sectionPath,
  title,
  children,
  schema,
  action
}: PropsWithChildren<FormPageProps<TFieldValues, TResult>>) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<TFieldValues>({
    resolver: zodResolver(schema),
    defaultValues
  })

  const onSubmit = async (values: TFieldValues) => {
    setIsLoading(true)

    try {
      const data = await action(values)

      toast.success(`Сохранено`)

      if (data && typeof data === 'object' && 'id' in data) {
        router.push(`${sectionPath}/${data.id}`)
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  const actions: PageHeaderProps['actions'] = [
    {
      title: 'Отмена',
      variant: 'secondary',
      route: sectionPath
    },
    {
      title: 'Сохранить',
      loading: isLoading,
      type: 'submit'
    }
  ]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <PageHeader title={title} actions={actions} />
        {children}
      </form>
    </Form>
  )
}
