import { Button } from '@/components/ui/button'
import { apiGet } from '@/lib/api'
import { FindAllResult, PageProps, ReviewEntity } from '@/types'
import type { Metadata } from 'next'
import Link from 'next/link'
import {
  AppPage,
  AppPageActions,
  AppPageContent,
  AppPageHeader,
  AppPageTitle
} from '../_components/AppPage'
import { ReviewList } from './_components/ReviewList'

export const metadata: Metadata = {
  title: 'Отзывы'
}

export default async function Page({ searchParams }: PageProps) {
  const fallbackData = await apiGet<FindAllResult<ReviewEntity>>('reviews', await searchParams)

  return (
    <AppPage>
      <AppPageHeader>
        <AppPageTitle>Отзывы</AppPageTitle>
        <AppPageActions>
          <Button asChild>
            <Link href="/dashboard/reviews/create">Добавить отзыв</Link>
          </Button>
        </AppPageActions>
      </AppPageHeader>
      <AppPageContent>
        <ReviewList fallbackData={fallbackData} />
      </AppPageContent>
    </AppPage>
  )
}
