import { OrdersPage } from '@/components/admin/OrdersPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Заказы - Divemaster'
}

export default function Page() {
  return <OrdersPage />
}
