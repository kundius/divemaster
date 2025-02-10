import { VerticalNav } from '@/components/VerticalNav'
import { PageLayout } from '@/components/admin/PageLayout'
import { Metadata } from 'next'
import { PropsWithChildren } from 'react'

export const metadata: Metadata = {
  title: 'Редактировать параметр'
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
      href: `/dashboard/options/${id}`
    },
    {
      title: 'Категории',
      href: `/dashboard/options/${id}/categories`
    }
  ]
  return (
    <PageLayout title="Редактировать параметр" aside={<VerticalNav items={items} />}>
      {children}
    </PageLayout>
  )
}
