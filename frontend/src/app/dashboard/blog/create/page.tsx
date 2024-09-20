import type { Metadata } from 'next'

import { PageLayout } from '@/components/admin/PageLayout'

import { BlogPostForm } from '../_components/BlogPostForm'

export const metadata: Metadata = {
  title: 'Добавить пост'
}

export default async function Page() {
  return (
    <PageLayout title="Добавить пост">
      <BlogPostForm />
    </PageLayout>
  )
}
