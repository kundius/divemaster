'use client'

import { Form } from '@/components/ui/form'
import { apiPost } from '@/lib/api'
import { BrandEntity } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { BrandForm, BrandFormFields, BrandFormSchema } from './BrandForm'

export function BrandCreate() {
  const router = useRouter()

  const form = useForm<BrandFormFields>({
    resolver: zodResolver(BrandFormSchema),
    defaultValues: {
      title: ''
    }
  })

  const onSubmit = async (values: BrandFormFields) => {
    try {
      const result = await apiPost<BrandEntity>(`brands`, values)
      toast.success('Бренд добавлен')
      router.push(`/dashboard/brands/${result.id}`)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Unknown error')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <BrandForm />
      </form>
    </Form>
  )
}
