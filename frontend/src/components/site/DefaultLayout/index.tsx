import { Header } from '@/components/site/Header'
import { Footer } from '@/components/site/Footer'
import { PropsWithChildren } from 'react'

export function DefaultLayout({ children }: PropsWithChildren) {
  return (
    <div>
      <Header />
      <div style={{ height: 2000, background: 'cyan' }}>{children}</div>
      <Footer />
    </div>
  )
}
