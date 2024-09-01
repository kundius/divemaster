import { Metadata } from 'next'

import { Container } from '@/components/site/Container'

import { Content } from './_components/Content'

export const metadata: Metadata = {
  title: 'Оформление заказа'
}

export default function Page() {
  return (
    <div className="pt-12 pb-40">
      <Container small>
        <Content />
      </Container>
    </div>
  )
}
