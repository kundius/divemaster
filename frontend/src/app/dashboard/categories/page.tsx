import { Button } from '@/components/ui/button'
import { apiGet } from '@/lib/api'
import { CategoryEntity, FindAllResult, PageProps } from '@/types'
import type { Metadata } from 'next'
import Link from 'next/link'
import {
  AppPage,
  AppPageActions,
  AppPageContent,
  AppPageHeader,
  AppPageTitle
} from '../_components/AppPage'
import { CategoriesList } from './_components/CategoryList'

export const metadata: Metadata = {
  title: 'Категории'
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams
  const fallbackData = await apiGet<FindAllResult<CategoryEntity>>('categories', {
    ...params,
    allowInactive: true
  })

  return (
    <AppPage>
      <AppPageHeader>
        <AppPageTitle>Категории</AppPageTitle>
        <AppPageActions>
          <Button asChild>
            <Link href="/dashboard/categories/create">Добавить категорию</Link>
          </Button>
        </AppPageActions>
      </AppPageHeader>
      <AppPageContent>
        <CategoriesList fallbackData={fallbackData} />
      </AppPageContent>
    </AppPage>
  )
}
