import { PageLayout } from '@/app/dashboard/_components/PageLayout'
import { apiGet } from '@/lib/api'
import { ApiTableData } from '@/lib/ApiTable/types'
import { OrderEntity, PageProps } from '@/types'
import type { Metadata } from 'next'
import { OrderList } from './_components/OrderList'

export const metadata: Metadata = {
  title: 'Заказы'
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams
  const fallbackData = await apiGet<ApiTableData<OrderEntity>>('orders', {
    ...params,
    withParent: true
  })
  return (
    <PageLayout title="Заказы">
      <OrderList fallbackData={fallbackData} />
    </PageLayout>
  )
}
