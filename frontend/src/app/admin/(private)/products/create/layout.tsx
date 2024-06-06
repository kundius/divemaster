import { PageHeader } from '@/components/admin/PageHeader'
import { ProductLayout } from '@/components/admin/ProductLayout'
import { Metadata } from 'next'
import { PropsWithChildren } from 'react'

export const metadata: Metadata = {
  title: 'Добавить товар'
}

export default function Layout({ children }: PropsWithChildren) {
  const nav = [
    {
      title: 'Товар',
      href: `/admin/products/create`
    },
    {
      title: 'Категории'
    },
    {
      title: 'Галерея'
    },
    {
      title: 'Параметры'
    }
  ]
  return (
    <div>
      <PageHeader title={`${metadata.title}`} />
      <ProductLayout nav={nav}>{children}</ProductLayout>
    </div>
  )
}
