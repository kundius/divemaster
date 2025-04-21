'use client'

import { Form } from '@/components/ui/form'
import { slugify } from '@/lib/utils'
import { CategoryEntity } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { CategoriesFormFields, CategoriesFormSchema, CategoryForm } from './CategoriesForm'
import { apiPatch } from '@/lib/api'
import { revalidateCategory } from './actions'

export interface CategoriesUpdateProps {
  initialData: CategoryEntity
}

export function CategoriesUpdate({ initialData }: CategoriesUpdateProps) {
  const form = useForm<CategoriesFormFields>({
    resolver: zodResolver(CategoriesFormSchema),
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

  const onSubmit = async (values: CategoriesFormFields) => {
    values.alias = slugify(values.alias || values.title)

    form.setValue('alias', values.alias)

    try {
      await apiPatch(`categories/${initialData.id}`, values)
      toast.success('Категория сохранена')
      revalidateCategory(values.alias)
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
