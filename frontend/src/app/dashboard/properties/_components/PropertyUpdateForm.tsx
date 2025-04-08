'use client'

import { useApiForm } from '@/lib/ApiForm'
import { PropertyEntity } from '@/types'
import { useRouter } from 'next/navigation'
import { PropertyForm, PropertyFormFields, PropertyFormSchema } from './PropertyForm'

export interface PropertyUpdateFormProps {
  initialData: PropertyEntity
}

export function PropertyUpdateForm({ initialData }: PropertyUpdateFormProps) {
  const router = useRouter()
  const [form, onSubmit] = useApiForm<PropertyFormFields, PropertyEntity>({
    url: `properties/${initialData.id}`,
    method: 'PATCH',
    schema: PropertyFormSchema,
    defaultValues: {
      inFilter: initialData.inFilter,
      key: initialData.key,
      caption: initialData.caption,
      type: initialData.type,
      rank: initialData.rank
    },
    onSuccess() {
      router.push(`/dashboard/properties`)
    }
  })
  return <PropertyForm form={form} onSubmit={onSubmit} />
}
