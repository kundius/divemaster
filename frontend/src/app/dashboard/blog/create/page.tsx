import type { Metadata } from 'next'

import { PageLayout } from '@/components/admin/PageLayout'

import { BlogPostForm } from '../_components/BlogPostForm'
import { VerticalNav } from '@/components/VerticalNav'

export const metadata: Metadata = {
  title: 'Добавить пост'
}

export default async function Page() {
  const items = [
    {
      title: 'Свойства',
      href: `/dashboard/blog/create`
    },
    {
      title: 'Метаданные'
    }
  ]
  return (
    <PageLayout title="Добавить пост" aside={<VerticalNav items={items} />}>
      <BlogPostForm />
    </PageLayout>
  )
}
