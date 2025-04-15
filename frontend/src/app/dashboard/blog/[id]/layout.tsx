import type { Metadata } from 'next'
import { PropsWithChildren } from 'react'

import { PageLayout } from '@/app/dashboard/_components/PageLayout'
import { VerticalNav } from '@/components/VerticalNav'
import { PageProps } from '@/types'

export const metadata: Metadata = {
  title: 'Редактировать пост'
}

export default async function Page({
  children,
  params
}: {
  children: React.ReactNode,
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const items = [
    {
      title: 'Свойства',
      href: `/dashboard/blog/${id}`
    },
    {
      title: 'Метаданные',
      href: `/dashboard/blog/${id}/metadata`
    }
  ]
  return (
    <PageLayout title="Редактировать пост" aside={<VerticalNav items={items} />}>
      {children}
    </PageLayout>
  )
}
