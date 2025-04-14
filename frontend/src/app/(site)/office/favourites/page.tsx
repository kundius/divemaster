import type { Metadata } from 'next'
import { SectionPage } from '@/components/SectionPage'
import { Headline } from '@/components/Headline'
import { HasScope } from '@/lib/HasScope'
import { Nav } from '../_components/Nav'
import { Favourites } from '../_components/Favourites'

export const metadata: Metadata = {
  title: 'Избранные товары / Личный кабинет'
}

export default function Page() {
  return <Favourites />
}
