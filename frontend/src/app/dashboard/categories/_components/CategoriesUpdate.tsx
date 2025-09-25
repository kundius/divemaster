'use client'

import { Form } from '@/components/ui/form'
import { apiPatch } from '@/lib/api'
import { slugify } from '@/lib/utils'
import { CategoryEntity } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { revalidateCategory } from './actions'
import { CategoriesFormFields, CategoriesFormSchema, CategoryForm } from './CategoriesForm'

export interface CategoriesUpdateProps {
  record: CategoryEntity
}

export function CategoriesUpdate({ record }: CategoriesUpdateProps) {
  const form = useForm<CategoriesFormFields>({
    resolver: zodResolver(CategoriesFormSchema),
    defaultValues: {
      parentId: record.parentId,
      imageId: record.imageId,
      active: record.active,
      rank: record.rank,
      description: record.description,
      longTitle: record.longTitle,
      title: record.title,
      alias: record.alias
    }
  })

  const onSubmit = async (values: CategoriesFormFields) => {
    values.alias = slugify(values.alias || values.title)
    form.setValue('alias', values.alias)

    try {
      await apiPatch(`categories/${record.id}`, values)
      await revalidateCategory(values.alias)
      toast.success('Категория сохранена')
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
