'use client'

import { useVespForm } from '@/components/vesp/VespForm'
import { slugify } from '@/lib/utils'
import { VespCategory } from '@/types'
import { CategoryForm, CategoryFormSchema } from '../CategoryForm'
import { PageHeader } from '../PageHeader'
import { useRouter } from 'next/navigation'

export interface CategoriesEditPageProps {
  initialData: VespCategory
}

export function CategoriesEditPage({ initialData }: CategoriesEditPageProps) {
  const router = useRouter()
  const [form, onSubmit] = useVespForm({
    url: `admin/categories/${initialData.id}`,
    method: 'PATCH',
    schema: CategoryFormSchema,
    mapValues: (values) => {
      values.alias = slugify(values.alias || values.title)
      form.setValue('alias', values.alias)
      return values
    },
    defaultValues: {
      active: initialData.active,
      description: initialData.description || '',
      title: initialData.title,
      alias: initialData.alias
    },
    onSuccess: () => {
      router.push('/admin/categories')
    }
  })
  return (
    <>
      <PageHeader title="Редактировать категорию" />
      <CategoryForm form={form} onSubmit={onSubmit} />
    </>
  )
}
