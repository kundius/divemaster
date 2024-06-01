'use client'

import { useApiForm } from '@/components/lib/ApiForm'
import { useRouter } from 'next/navigation'
import { BrandForm, BrandFormFields, BrandFormSchema } from '../BrandForm'
import { PageHeader } from '../PageHeader'

export function BrandsCreatePage() {
  const router = useRouter()
  const [form, onSubmit] = useApiForm<BrandFormFields>({
    url: `brands`,
    method: 'POST',
    schema: BrandFormSchema,
    defaultValues: {
      title: ''
    },
    onSuccess: () => {
      router.push('/admin/brands')
    }
  })
  return (
    <>
      <PageHeader title="Добавить бренд" />
      <BrandForm form={form} onSubmit={onSubmit} />
    </>
  )
}
