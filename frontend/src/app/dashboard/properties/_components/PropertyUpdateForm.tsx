'use client'

import { Form } from '@/components/ui/form'
import { apiPatch } from '@/lib/api'
import { PropertyEntity } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { PropertyForm, PropertyFormFields, PropertyFormSchema } from './PropertyForm'

export interface PropertyUpdateFormProps {
  record: PropertyEntity
}

export function PropertyUpdateForm({ record }: PropertyUpdateFormProps) {
  const form = useForm<PropertyFormFields>({
    resolver: zodResolver(PropertyFormSchema),
    defaultValues: {
      inFilter: record.inFilter,
      key: record.key,
      caption: record.caption,
      type: record.type,
      rank: record.rank
    }
  })

  const onSubmit = async (values: PropertyFormFields) => {
    try {
      await apiPatch(`properties/${record.id}`, values)
      toast.success('Характеристика изменена')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Unknown error')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <PropertyForm />
      </form>
    </Form>
  )
}
