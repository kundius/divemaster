import { Container } from '@/components/site/Container'
import { PropsWithChildren } from 'react'
import { Nav } from './_components/Nav'
import { SectionPage } from '@/components/SectionPage'
import { Headline } from '@/components/Headline'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <SectionPage>
      <Headline className="mb-12 max-lg:mb-8 max-md:mb-6" title="Личный кабинет" />
      <div className="flex">
        <div className="w-1/4">
          <Nav />
        </div>
        <div className="w-3/4">{children}</div>
      </div>
    </SectionPage>
  )
}
