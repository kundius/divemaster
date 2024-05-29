'use client'

import { useApiForm } from '@/components/lib/ApiForm'
import { slugify } from '@/lib/utils'
import { CategoryEntity } from '@/types'
import { CategoryForm, CategoryFormFields, CategoryFormSchema } from '../CategoryForm'
import { PageHeader } from '../PageHeader'
import { useRouter } from 'next/navigation'
import { number } from 'zod'

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
      parentId:
        typeof initialData.parent === 'number'
          ? initialData.parent
          : initialData.parent?.id || null,
      imageId:
        typeof initialData.image === 'number'
          ? initialData.image
          : initialData.image?.id || null,
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
