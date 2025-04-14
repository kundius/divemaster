import type { Metadata } from 'next'
import { SectionPage } from '@/components/SectionPage'
import { Headline } from '@/components/Headline'
import { HasScope } from '@/lib/HasScope'
import { UnauthorizedFallback } from '../_components/UnauthorizedFallback'
import { Nav } from '../_components/Nav'
import { Comparison } from '../_components/Comparison'

export const metadata: Metadata = {
  title: 'Сравнение товаров / Личный кабинет'
}

export default function Page() {
  return <Comparison />
}
