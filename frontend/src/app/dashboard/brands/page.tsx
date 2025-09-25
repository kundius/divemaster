import { Button } from '@/components/ui/button'
import { apiGet } from '@/lib/api'
import { BrandEntity, FindAllResult, PageProps } from '@/types'
import type { Metadata } from 'next'
import Link from 'next/link'
import {
  AppPage,
  AppPageActions,
  AppPageContent,
  AppPageHeader,
  AppPageTitle
} from '../_components/AppPage'
import { BrandList } from './_components/BrandList'

export const metadata: Metadata = {
  title: 'Бренды'
}

export default async function Page({ searchParams }: PageProps) {
  const fallbackData = await apiGet<FindAllResult<BrandEntity>>('brands', await searchParams)

  return (
    <AppPage>
      <AppPageHeader>
        <AppPageTitle>Бренды</AppPageTitle>
        <AppPageActions>
          <Button asChild>
            <Link href="/dashboard/brands/create">Добавить бренд</Link>
          </Button>
        </AppPageActions>
      </AppPageHeader>
      <AppPageContent>
        <BrandList fallbackData={fallbackData} />
      </AppPageContent>
    </AppPage>
  )
}
