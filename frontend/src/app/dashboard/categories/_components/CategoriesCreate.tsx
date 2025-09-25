'use client'

import { Form } from '@/components/ui/form'
import { apiPost } from '@/lib/api'
import { slugify } from '@/lib/utils'
import { CategoryEntity } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { CategoriesFormFields, CategoriesFormSchema, CategoryForm } from './CategoriesForm'

export function CategoriesCreate() {
  const router = useRouter()

  const form = useForm<CategoriesFormFields>({
    resolver: zodResolver(CategoriesFormSchema),
    defaultValues: {
      active: true,
      title: '',
      alias: '',
      rank: 0,
      description: null,
      longTitle: null,
      parentId: null,
      imageId: null
    }
  })

  const onSubmit = async (values: CategoriesFormFields) => {
    values.alias = slugify(values.alias || values.title)

    form.setValue('alias', values.alias)

    try {
      const data = await apiPost<CategoryEntity>(`categories`, values)
      toast.success('Категория сохранена')
      router.push(`/admin/categories/${data.id}`)
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CategoryForm />
      </form>
    </Form>
  )
}
