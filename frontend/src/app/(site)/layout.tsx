import { Footer } from '@/components/site/Footer'
import { Header } from '@/components/site/Header'
import { PropsWithChildren } from 'react'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Header />
      {children}
      <div className="hidden">
        <Footer />
      </div>
    </>
  )
}
