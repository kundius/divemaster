import type { Metadata } from 'next'
import { ProfileOrders } from '../_components/ProfileOrders'

export const metadata: Metadata = {
  title: 'Мои заказы / Личный кабинет'
}

export default function Page() {
  return <ProfileOrders />
}
