'use client'

import { useVespForm } from '@/components/vesp/VespForm'
import { slugify } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { CategoryForm, CategoryFormSchema } from '../CategoryForm'
import { PageHeader } from '../PageHeader'

export function CategoriesAddPage() {
  const router = useRouter()
  const [form, onSubmit] = useVespForm({
    url: `admin/categories`,
    method: 'PUT',
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
      alias: ''
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