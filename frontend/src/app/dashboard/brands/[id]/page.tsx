import { apiGet } from '@/lib/api'
import { BrandEntity, PageProps } from '@/types'
import type { Metadata } from 'next'
import { AppPage, AppPageContent, AppPageHeader, AppPageTitle } from '../../_components/AppPage'
import { BrandUpdate } from '../_components/BrandUpdate'

export const metadata: Metadata = {
  title: 'Редактировать бренд'
}

export default async function Page({ params }: PageProps<{ id: number }>) {
  const { id } = await params
  const record = await apiGet<BrandEntity>(`brands/${id}`)
  return (
    <AppPage>
      <AppPageHeader>
        <AppPageTitle>Редактировать бренд</AppPageTitle>
      </AppPageHeader>
      <AppPageContent>
        <BrandUpdate record={record} />
      </AppPageContent>
    </AppPage>
  )
}
