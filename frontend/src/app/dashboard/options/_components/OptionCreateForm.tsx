'use client'

import { useApiForm } from '@/lib/ApiForm'
import { OptionEntity, OptionType } from '@/types'
import { useRouter } from 'next/navigation'
import { OptionForm, OptionFormFields, OptionFormSchema } from './OptionForm'

export function OptionCreateForm() {
  const router = useRouter()
  const [form, onSubmit] = useApiForm<OptionFormFields, OptionEntity>({
    url: `options`,
    method: 'POST',
    schema: OptionFormSchema,
    defaultValues: {
      inFilter: false,
      key: '',
      caption: '',
      type: OptionType.TEXTFIELD,
      rank: 0
    },
    onSuccess() {
      router.push(`/admin/options`)
    }
  })
  return <OptionForm form={form} onSubmit={onSubmit} />
}
