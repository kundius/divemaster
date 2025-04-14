import type { Metadata } from 'next'
import { SectionPage } from '@/components/SectionPage'
import { HasScope } from '@/lib/HasScope'
import { Headline } from '@/components/Headline'
import { UnauthorizedFallback } from '../_components/UnauthorizedFallback'
import { Nav } from '../_components/Nav'
import { ProfileOrders } from '../_components/ProfileOrders'

export const metadata: Metadata = {
  title: 'Мои заказы / Личный кабинет'
}

export default function Page() {
  return <ProfileOrders />
}
