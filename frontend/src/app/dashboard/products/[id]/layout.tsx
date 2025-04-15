import { VerticalNav } from '@/components/VerticalNav'
import { PageLayout } from '@/app/dashboard/_components/PageLayout'
import { Metadata } from 'next'
import { PropsWithChildren } from 'react'

export const metadata: Metadata = {
  title: 'Редактировать товар'
}

export default async function Layout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const items = [
    {
      title: 'Свойства',
      href: `/dashboard/products/${id}`
    },
    {
      title: 'Описание',
      href: `/dashboard/products/${id}/description`
    },
    {
      title: 'Категории',
      href: `/dashboard/products/${id}/categories`
    },
    {
      title: 'Галерея',
      href: `/dashboard/products/${id}/gallery`
    },
    {
      title: 'Характеристики',
      href: `/dashboard/products/${id}/options`
    },
    // {
    //   title: 'Отзывы',
    //   href: `/dashboard/products/${id}/reviews`
    // },
    // {
    //   title: 'Связи',
    //   href: `/dashboard/products/${id}/links`
    // },
    {
      title: 'Торговые предложения',
      href: `/dashboard/products/${id}/offers`
    }
  ]
  return (
    <PageLayout title="Редактировать товар" aside={<VerticalNav items={items} />}>
      {children}
    </PageLayout>
  )
}
