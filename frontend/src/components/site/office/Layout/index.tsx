import { PropsWithChildren } from 'react'
import { Container } from '../../Container'
import { Nav } from '../Nav'

export function Layout({ children }: PropsWithChildren) {
  return (
    <div className="pt-12 pb-40">
      <Container>
        <div className="text-4xl font-sans-narrow uppercase font-bold mb-12">Личный кабинет</div>
        <div className="flex">
          <div className="w-1/3">
            <Nav />
          </div>
          <div className="w-2-3">{children}</div>
        </div>
      </Container>
    </div>
  )
}
