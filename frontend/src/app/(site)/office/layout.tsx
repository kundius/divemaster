import { Container } from '@/components/site/Container'
import { PropsWithChildren } from 'react'
import { Nav } from './_components/Nav'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="pt-12 pb-40">
      <Container>
        <div className="text-4xl font-sans-narrow uppercase font-bold mb-12">Личный кабинет</div>
        <div className="flex">
          <div className="w-1/4">
            <Nav />
          </div>
          <div className="w-3/4">{children}</div>
        </div>
      </Container>
    </div>
  )
}
