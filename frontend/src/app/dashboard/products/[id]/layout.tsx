import { VerticalNav } from '@/components/VerticalNav'
import { PageLayout } from '@/components/admin/PageLayout'
import { Metadata } from 'next'
import { PropsWithChildren } from 'react'

export const metadata: Metadata = {
  title: 'Редактировать товар'
}

export default function Layout({
  children,
  params
}: PropsWithChildren<{ params: { id: string } }>) {
  const items = [
    {
      title: 'Свойства',
      href: `/dashboard/products/${params.id}`
    },
    {
      title: 'Описание',
      href: `/dashboard/products/${params.id}/description`
    },
    {
      title: 'Категории',
      href: `/dashboard/products/${params.id}/categories`
    },
    {
      title: 'Галерея',
      href: `/dashboard/products/${params.id}/gallery`
    },
    {
      title: 'Характеристики',
      href: `/dashboard/products/${params.id}/options`
    },
    // {
    //   title: 'Отзывы',
    //   href: `/dashboard/products/${params.id}/reviews`
    // },
    // {
    //   title: 'Связи',
    //   href: `/dashboard/products/${params.id}/links`
    // },
    {
      title: 'Торговые предложения',
      href: `/dashboard/products/${params.id}/offers`
    }
  ]
  return (
    <PageLayout title="Редактировать товар" aside={<VerticalNav items={items} />}>
      {children}
    </PageLayout>
  )
}
