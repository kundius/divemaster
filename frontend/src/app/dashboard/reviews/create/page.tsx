import type { Metadata } from 'next'

import { AppPage, AppPageContent, AppPageHeader, AppPageTitle } from '../../_components/AppPage'
import { ReviewCreate } from '../_components/ReviewCreate'

export const metadata: Metadata = {
  title: 'Добавить отзыв'
}

export default async function Page() {
  return (
    <AppPage>
      <AppPageHeader>
        <AppPageTitle>Добавить отзыв</AppPageTitle>
      </AppPageHeader>
      <AppPageContent>
        <ReviewCreate />
      </AppPageContent>
    </AppPage>
  )
}
