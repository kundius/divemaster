import { Container } from '@/components/site/Container'
import type { Metadata } from 'next'
import { SignInForm } from '../_components/SignInForm'

export const metadata: Metadata = {
  title: 'Вход'
}

export default function Page() {
  return (
    <div className="pt-12 pb-40">
      <Container>
        <div className="pb-3 border-b border-neutral-100 mb-6">
          <div className="text-4xl font-sans-narrow uppercase font-bold">Вход</div>
        </div>
        <SignInForm />
      </Container>
    </div>
  )
}
