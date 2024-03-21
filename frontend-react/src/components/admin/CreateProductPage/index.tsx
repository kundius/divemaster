'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PageHeader, PageHeaderProps } from '@/components/admin/PageHeader'

export async function CreateProductPage() {
  const actions: PageHeaderProps['actions'] = [
    {
      title: 'Отмена',
      variant: 'secondary',
      route: '/admin/products'
    },
    {
      title: 'Сохранить',
      onClick: () => alert('test')
    }
  ]

  return (
    <div>
      <PageHeader title="Добавить товар" actions={actions} />

      <div className="rounded-md border">form</div>
    </div>
  )
}
