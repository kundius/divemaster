import type { Metadata } from 'next'
import Link from 'next/link'
import { PageLayout } from '@/app/dashboard/_components/PageLayout'
import { Button } from '@/components/ui/button'
import { BlogPostEntity, FindAllResult, PageProps } from '@/types'
import { BlogPostList } from './_components/BlogPostList'
import { apiGet } from '@/lib/api'

export const metadata: Metadata = {
  title: 'Блог'
}

export default async function Page({ searchParams }: PageProps) {
  const fallbackData = await apiGet<FindAllResult<BlogPostEntity>>('blog/post', await searchParams)

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
