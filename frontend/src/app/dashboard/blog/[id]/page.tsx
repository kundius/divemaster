import type { Metadata } from 'next'

import { PageLayout } from '@/components/admin/PageLayout'
import { apiGet } from '@/lib/api'
import { withServerAuth } from '@/lib/api/with-server-auth'
import { BlogPostEntity, PageProps } from '@/types'

import { BlogPostForm } from '../_components/BlogPostForm'

export const metadata: Metadata = {
  title: 'Редактировать пост'
}

export default async function Page({ params }: PageProps<{ id: string }>) {
  const record = await apiGet<BlogPostEntity>(`blog/post/${params.id}`, withServerAuth())
  return (
    <PageLayout title="Редактировать пост">
      <BlogPostForm record={record} />
    </PageLayout>
  )
}
