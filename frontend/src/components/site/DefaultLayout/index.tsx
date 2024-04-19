import { Header } from '@/components/site/Header'
import { Footer } from '@/components/site/Footer'
import { PropsWithChildren } from 'react'

export function DefaultLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}
