'use client'

import { useApiForm } from '@/lib/ApiForm'
import { PropertyEntity, PropertyType } from '@/types'
import { useRouter } from 'next/navigation'
import { PropertyForm, PropertyFormFields, PropertyFormSchema } from './PropertyForm'

export function PropertyCreateForm() {
  const router = useRouter()
  const [form, onSubmit] = useApiForm<PropertyFormFields, PropertyEntity>({
    url: `properties`,
    method: 'POST',
    schema: PropertyFormSchema,
    defaultValues: {
      inFilter: false,
      key: '',
      caption: '',
      type: PropertyType.TEXTFIELD,
      rank: 0
    },
    onSuccess() {
      router.push(`/dashboard/properties`)
    }
  })
  return <PropertyForm form={form} onSubmit={onSubmit} />
}
