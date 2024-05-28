'use client'

import { useApiForm } from '@/components/lib/ApiForm'
import { slugify } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { CategoryForm, CategoryFormFields, CategoryFormSchema } from '../CategoryForm'
import { PageHeader } from '../PageHeader'

export function CategoriesAddPage() {
  const router = useRouter()
  const [form, onSubmit] = useApiForm<CategoryFormFields>({
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
      description: '',
      title: '',
      alias: '',
      parentId: null
    },
    onSuccess: () => {
      router.push('/admin/categories')
    }
  })
  return (
    <>
      <PageHeader title="Добавить категорию" />
      <CategoryForm form={form} onSubmit={onSubmit} />
    </>
  )
}
