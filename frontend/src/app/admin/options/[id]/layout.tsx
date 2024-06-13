import { VerticalNav } from '@/components/VerticalNav'
import { PageLayout } from '@/components/admin/PageLayout'
import { Metadata } from 'next'
import { PropsWithChildren } from 'react'

export const metadata: Metadata = {
  title: 'Редактировать параметр'
}

export default function Layout({
  children,
  params
}: PropsWithChildren<{ params: { id: string } }>) {
  const items = [
    {
      title: 'Свойства',
      href: `/admin/options/${params.id}`
    },
    {
      title: 'Категории',
      href: `/admin/options/${params.id}/categories`
    }
  ]
  return (
    <PageLayout title="Редактировать параметр" aside={<VerticalNav items={items} />}>
      {children}
    </PageLayout>
  )
}
