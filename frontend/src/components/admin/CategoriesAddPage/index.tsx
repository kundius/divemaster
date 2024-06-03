'use client'

import { useApiForm } from '@/lib/ApiForm'
import { slugify } from '@/lib/utils'
import { CategoryEntity } from '@/types'
import { useRouter } from 'next/navigation'
import { CategoryForm, CategoryFormFields, CategoryFormSchema } from '../CategoryForm'
import { PageHeader } from '../PageHeader'

export function CategoriesAddPage() {
  const router = useRouter()
  const [form, onSubmit] = useApiForm<CategoryFormFields, CategoryEntity>({
    url: `categories`,
    method: 'POST',
    schema: CategoryFormSchema,
    mapValues: (values) => {
      values.alias = slugify(values.alias || values.title)
      form.setValue('alias', values.alias)
      return values
    },
    defaultValues: {
      active: true,
      title: '',
      alias: '',
      description: null,
      longTitle: null,
      parentId: null,
      imageId: null
    },
    onSuccess: (data) => {
      router.push(`/admin/categories/${data.id}`)
    }
  })
  return (
    <>
      <PageHeader title="Добавить категорию" />
      <CategoryForm form={form} onSubmit={onSubmit} />
    </>
  )
}
