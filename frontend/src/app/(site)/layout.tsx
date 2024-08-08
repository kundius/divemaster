import { Footer } from '@/components/site/Footer'
import { Header } from '@/components/site/Header'
import { PropsWithChildren } from 'react'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="grow">{children}</div>
      <Footer />
    </div>
  )
}
