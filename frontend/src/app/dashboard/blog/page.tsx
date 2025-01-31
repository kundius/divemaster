import type { Metadata } from 'next'
import Link from 'next/link'

import { PageLayout } from '@/components/admin/PageLayout'
import { Button } from '@/components/ui/button'
import { apiGet } from '@/lib/api'
import { withServerAuth } from '@/lib/api/with-server-auth'
import { BlogPostEntity, FindAllResult, PageProps } from '@/types'

import { BlogPostList } from './_components/BlogPostList'

export const metadata: Metadata = {
  title: 'Блог'
}

export default async function Page({ searchParams }: PageProps) {
  const fallbackData = await apiGet<FindAllResult<BlogPostEntity>>(
    'blog/post',
    await searchParams,
    withServerAuth()
  )

  const actions = [
    <Button asChild key="create">
      <Link href="/dashboard/blog/create">Добавить запись</Link>
    </Button>
  ]

  return (
    <PageLayout title="Блог" actions={actions}>
      <BlogPostList fallbackData={fallbackData} />
    </PageLayout>
  )
}
