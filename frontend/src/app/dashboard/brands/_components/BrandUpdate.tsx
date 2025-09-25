'use client'

import { Form } from '@/components/ui/form'
import { apiPatch } from '@/lib/api'
import { BrandEntity } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { BrandForm, BrandFormFields, BrandFormSchema } from './BrandForm'

export interface BrandUpdateProps {
  record: BrandEntity
}

export function BrandUpdate({ record }: BrandUpdateProps) {
  const form = useForm<BrandFormFields>({
    resolver: zodResolver(BrandFormSchema),
    defaultValues: {
      title: record.title
    }
  })

  const onSubmit = async (values: BrandFormFields) => {
    try {
      await apiPatch(`brands/${record.id}`, values)
      toast.success('Бренд изменен')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Unknown error')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <BrandForm />
      </form>
    </Form>
  )
}
