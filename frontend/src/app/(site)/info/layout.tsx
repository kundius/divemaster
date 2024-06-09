import { Container } from '@/components/site/Container'
import { PropsWithChildren } from 'react'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="pt-12 pb-40">
      <Container>
        {children}
      </Container>
    </div>
  )
}
