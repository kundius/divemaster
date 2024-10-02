import { Metadata } from 'next'
import { PropsWithChildren } from 'react'

import { Footer } from '@/components/site/Footer'
import { Header } from '@/components/site/Header'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Интернет-магазин подводного снаряжени DiveMaster`,
    description:
      'Интернет-магазин подводного снаряжения ДАЙВМАСТЕР. Всё для подводной охоты, дайвинга, плавания - DiveMaster. Предлагаем купить на сайте экипировку оптом и в розницу. Низкие цены в Воронеже, Москве, СПб, Краснодаре, России и других странах мира. Бесплатная доставка.',
    keywords: 'подводное снаряжение, подводная охота, дайвинг, плавание'
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
