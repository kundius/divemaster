'use client'

import { Form } from '@/components/ui/form'
import { apiPost } from '@/lib/api'
import { PropertyEntity, PropertyType } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { PropertyForm, PropertyFormFields, PropertyFormSchema } from './PropertyForm'

export function PropertyCreateForm() {
  const router = useRouter()

  const form = useForm<PropertyFormFields>({
    resolver: zodResolver(PropertyFormSchema),
    defaultValues: {
      inFilter: false,
      key: '',
      caption: '',
      type: PropertyType.TEXTFIELD,
      rank: 0
    }
  })

  const onSubmit = async (values: PropertyFormFields) => {
    try {
      const result = await apiPost<PropertyEntity>(`properties`, values)
      toast.success('Характеристика добавлена')
      router.push(`/dashboard/properties/${result.id}`)
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
