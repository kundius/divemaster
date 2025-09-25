import { apiGet } from '@/lib/api'
import { FindAllResult, OrderEntity, PageProps } from '@/types'
import type { Metadata } from 'next'
import { AppPage, AppPageContent, AppPageHeader, AppPageTitle } from '../_components/AppPage'
import { OrderList } from './_components/OrderList'

export const metadata: Metadata = {
  title: 'Заказы'
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams
  const fallbackData = await apiGet<FindAllResult<OrderEntity>>(
    'orders',
    {
      ...params,
      withParent: true
    },
    {
      ssr: true
    }
  )
  return (
    <AppPage>
      <AppPageHeader>
        <AppPageTitle>Заказы</AppPageTitle>
      </AppPageHeader>
      <AppPageContent>
        <OrderList fallbackData={fallbackData} />
      </AppPageContent>
    </AppPage>
  )
}
