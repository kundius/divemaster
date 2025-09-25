import { Button } from '@/components/ui/button'
import { apiGet } from '@/lib/api'
import { FindAllResult, PageProps, PropertyEntity } from '@/types'
import type { Metadata } from 'next'
import Link from 'next/link'
import {
  AppPage,
  AppPageActions,
  AppPageContent,
  AppPageHeader,
  AppPageTitle
} from '../_components/AppPage'
import { PropertyList } from './_components/PropertyList'

export const metadata: Metadata = {
  title: 'Характеристики'
}

export default async function Page({ searchParams }: PageProps) {
  const fallbackData = await apiGet<FindAllResult<PropertyEntity>>('properties', await searchParams)

  return (
    <AppPage>
      <AppPageHeader>
        <AppPageTitle>Характеристики</AppPageTitle>
        <AppPageActions>
          <Button asChild>
            <Link href="/dashboard/properties/create">Добавить</Link>
          </Button>
        </AppPageActions>
      </AppPageHeader>
      <AppPageContent>
        <PropertyList fallbackData={fallbackData} />
      </AppPageContent>
    </AppPage>
  )
}
