'use client'

import { useApiForm } from '@/components/lib/ApiForm'
import { BrandEntity } from '@/types'
import { useRouter } from 'next/navigation'
import { BrandForm, BrandFormFields, BrandFormSchema } from '../BrandForm'
import { PageHeader } from '../PageHeader'

export interface BrandsUpdatePageProps {
  initialData: BrandEntity
}

export function BrandsUpdatePage({ initialData }: BrandsUpdatePageProps) {
  const router = useRouter()
  const [form, onSubmit] = useApiForm<BrandFormFields>({
    url: `brands/${initialData.id}`,
    method: 'PATCH',
    schema: BrandFormSchema,
    defaultValues: {
      title: initialData.title
    },
    onSuccess: () => {
      router.push('/admin/brands')
    }
  })
  return (
    <>
      <PageHeader title="Редактировать бренд" />
      <BrandForm form={form} onSubmit={onSubmit} />
    </>
  )
}
