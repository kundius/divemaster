'use client'

import { useApiForm } from '@/lib/ApiForm'
import { OptionEntity } from '@/types'
import { useRouter } from 'next/navigation'
import { OptionForm, OptionFormFields, OptionFormSchema } from './OptionForm'

export interface OptionUpdateFormProps {
  initialData: OptionEntity
}

export function OptionUpdateForm({ initialData }: OptionUpdateFormProps) {
  const router = useRouter()
  const [form, onSubmit] = useApiForm<OptionFormFields, OptionEntity>({
    url: `options/${initialData.id}`,
    method: 'PATCH',
    schema: OptionFormSchema,
    defaultValues: {
      inFilter: initialData.inFilter,
      key: initialData.key,
      caption: initialData.caption,
      type: initialData.type,
      rank: initialData.rank
    },
    onSuccess() {
      router.push(`/dashboard/options`)
    }
  })
  return <OptionForm form={form} onSubmit={onSubmit} />
}
