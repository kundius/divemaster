import { PageHeader } from '@/components/admin/PageHeader'
import { ProductLayout } from '@/components/admin/ProductLayout'
import { Metadata } from 'next'
import { PropsWithChildren } from 'react'

export const metadata: Metadata = {
  title: 'Редактировать товар'
}

export default function Layout({
  children,
  params
}: PropsWithChildren<{ params: { id: string } }>) {
  const nav = [
    {
      title: 'Товар',
      href: `/admin/products/${params.id}`
    },
    {
      title: 'Категории',
      href: `/admin/products/${params.id}/categories`
    },
    {
      title: 'Галерея',
      href: `/admin/products/${params.id}/gallery`
    },
    {
      title: 'Параметры',
      href: `/admin/products/${params.id}/options`
    }
  ]
  return (
    <div>
      <PageHeader title={`${metadata.title}`} />
      <ProductLayout nav={nav}>{children}</ProductLayout>
    </div>
  )
}
