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
      href: `/admin/products/${params.id}`
    },
    {
      title: 'Описание',
      href: `/admin/products/${params.id}/description`
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
      title: 'Характеристики',
      href: `/admin/products/${params.id}/options`
    },
    // {
    //   title: 'Отзывы',
    //   href: `/admin/products/${params.id}/reviews`
    // },
    // {
    //   title: 'Связи',
    //   href: `/admin/products/${params.id}/links`
    // },
    {
      title: 'Торговые предложения',
      href: `/admin/products/${params.id}/offers`
    }
  ]
  return (
    <PageLayout title="Редактировать товар" aside={<VerticalNav items={items} />}>
      {children}
    </PageLayout>
  )
}
