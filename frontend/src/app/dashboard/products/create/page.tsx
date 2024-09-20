import { PageLayout } from '@/components/admin/PageLayout'
import type { Metadata } from 'next'
import { ProductCreate } from '../_components/ProductCreate'
import { VerticalNav } from '@/components/VerticalNav'

export const metadata: Metadata = {
  title: 'Добавить товар'
}

export default function Page() {
  const items = [
    {
      title: 'Свойства',
      href: `/dashboard/products/create`
    },
    {
      title: 'Описание'
    },
    {
      title: 'Категории'
    },
    {
      title: 'Галерея'
    },
    {
      title: 'Характеристики'
    },
    {
      title: 'Отзывы'
    },
    {
      title: 'Связи'
    }
  ]
  return (
    <PageLayout title="Добавить товар" aside={<VerticalNav items={items} />}>
      <ProductCreate />
    </PageLayout>
  )
}
