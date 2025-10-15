import type { Metadata } from 'next'

import { apiGet } from '@/lib/api'
import { PageProps, ReviewEntity } from '@/types'
import { AppPage, AppPageContent, AppPageHeader, AppPageTitle } from '../../_components/AppPage'
import { ReviewUpdate } from '../_components/ReviewUpdate'

export const metadata: Metadata = {
  title: 'Редактировать отзыв'
}

export default async function Page({ params }: PageProps<{ id: number }>) {
  const { id } = await params
  const record = await apiGet<ReviewEntity>(`reviews/${id}`)
  return (
    <AppPage>
      <AppPageHeader>
        <AppPageTitle>Редактировать отзыв</AppPageTitle>
      </AppPageHeader>
      <AppPageContent>
        <ReviewUpdate record={record} />
      </AppPageContent>
    </AppPage>
  )
}
