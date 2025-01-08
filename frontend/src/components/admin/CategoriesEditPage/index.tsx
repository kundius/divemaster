'use client'

import { useApiForm } from '@/lib/ApiForm'
import { slugify } from '@/lib/utils'
import { CategoryEntity } from '@/types'
import { useRouter } from 'next/navigation'
import { CategoryForm, CategoryFormFields, CategoryFormSchema } from '../CategoryForm'
import { PageHeader } from '../PageHeader'

export interface CategoriesEditPageProps {
  initialData: CategoryEntity
}

export function CategoriesEditPage({ initialData }: CategoriesEditPageProps) {
  const router = useRouter()
  const [form, onSubmit] = useApiForm<CategoryFormFields>({
    url: `categories/${initialData.id}`,
    method: 'PATCH',
    schema: CategoryFormSchema,
    mapValues: (values) => {
      values.alias = slugify(values.alias || values.title)
      form.setValue('alias', values.alias)
      return values
    },
    defaultValues: {
      parentId: initialData.parentId,
      imageId: initialData.imageId,
      active: initialData.active,
      rank: initialData.rank,
      description: initialData.description,
      longTitle: initialData.longTitle,
      title: initialData.title,
      alias: initialData.alias
    }
  })
  return (
    <>
      <PageHeader title="Редактировать категорию" />
      <CategoryForm form={form} onSubmit={onSubmit} />
    </>
  )
}
