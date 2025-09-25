import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BlogPostEntity, FindAllResult, PageProps } from '@/types'
import { BlogPostList } from './_components/BlogPostList'
import { apiGet } from '@/lib/api'
import {
  AppPage,
  AppPageActions,
  AppPageContent,
  AppPageHeader,
  AppPageTitle
} from '../_components/AppPage'

export const metadata: Metadata = {
  title: 'Блог'
}

export default async function Page({ searchParams }: PageProps) {
  const fallbackData = await apiGet<FindAllResult<BlogPostEntity>>('blog/post', await searchParams)

  return (
    <AppPage>
      <AppPageHeader>
        <AppPageTitle>Блог</AppPageTitle>
        <AppPageActions>
          <Button asChild>
            <Link href="/dashboard/blog/create">Добавить запись</Link>
          </Button>
        </AppPageActions>
      </AppPageHeader>
      <AppPageContent>
        <BlogPostList fallbackData={fallbackData} />
      </AppPageContent>
    </AppPage>
  )
}
