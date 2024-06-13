import { PageLayout } from '@/components/admin/PageLayout'
import type { Metadata } from 'next'
import { ProductCreateForm } from '../_components/ProductCreateForm'
import { VerticalNav } from '@/components/VerticalNav'

export const metadata: Metadata = {
  title: 'Добавить товар'
}

export default function Page() {
  const items = [
    {
      title: 'Свойства',
      href: `/admin/products/create`
    },
    {
      title: 'Категории'
    }
  ]
  return (
    <PageLayout title="Добавить товар" aside={<VerticalNav items={items} />}>
      <ProductCreateForm />
    </PageLayout>
  )
}
