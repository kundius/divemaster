import type { Metadata } from 'next'
import { PropsWithChildren } from 'react'

import { PageLayout } from '@/components/admin/PageLayout'
import { VerticalNav } from '@/components/VerticalNav'

export const metadata: Metadata = {
  title: 'Редактировать пост'
}

export default async function Page({
  children,
  params
}: PropsWithChildren<{ params: { id: string } }>) {
  const items = [
    {
      title: 'Свойства',
      href: `/dashboard/blog/${params.id}`
    },
    {
      title: 'Метаданные',
      href: `/dashboard/blog/${params.id}/metadata`
    }
  ]
  return (
    <PageLayout title="Редактировать пост" aside={<VerticalNav items={items} />}>
      {children}
    </PageLayout>
  )
}
