import { Metadata } from 'next'

import { Headline } from '@/components/Headline'
import { Container } from '@/components/site/Container'

export const metadata: Metadata = {
  title: 'Информация о заказе'
}

export default function Page({ params: { hash } }: { params: { hash: string } }) {
  return (
    <div className="pt-12 pb-40">
      <Container small>
        <Headline className="mb-8" title="Информация о заказе" />
        {hash}
      </Container>
    </div>
  )
}
