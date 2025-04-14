import type { Metadata } from 'next'
import { AccountSettings } from './_components/AccountSettings'
import { SectionPage } from '@/components/SectionPage'
import { HasScope } from '@/lib/HasScope'
import { Headline } from '@/components/Headline'
import { Nav } from './_components/Nav'
import { UnauthorizedFallback } from './_components/UnauthorizedFallback'

export const metadata: Metadata = {
  title: 'Мои данные / Личный кабинет'
}

export default function Page() {
  return <AccountSettings />
}
