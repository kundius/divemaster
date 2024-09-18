import { Metadata } from 'next'
import { PropsWithChildren } from 'react'

import { Footer } from '@/components/site/Footer'
import { Header } from '@/components/site/Header'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Интернет-магазин подводного снаряжени DiveMaster`
  }
}

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="grow">{children}</div>
      <Footer />
    </div>
  )
}
