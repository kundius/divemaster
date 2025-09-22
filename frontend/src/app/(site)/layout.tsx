import { HeaderExtra } from '@/components/HeaderExtra'
import { Metadata } from 'next'
import { PropsWithChildren } from 'react'
import { Header } from './_components/Header'
import { Footer } from './_components/Footer'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Интернет-магазин подводного снаряжения DiveMaster`,
    description:
      'Интернет-магазин подводного снаряжения ДАЙВМАСТЕР. Всё для подводной охоты, дайвинга, плавания. Доставка по России бесплатно. Предлагаем купить на сайте экипировку оптом и в розницу. Низкие цены в Воронеже, Москве, СПб, Краснодаре, Крым, Сочи, Ростов, России и других странах мира. Широкий ассортимент снаряжения.',
    keywords:
      'подводное снаряжение, товары для подводной охоты, снаряжение для дайвинга, товары для плавания, купить подводное снаряжение, магазин подводного снаряжения, подводные ружья, маски, ласты, боты, неопреновые носки, подводные арбалеты, пневматические ружья, купить груза, купить гарпун, подводное снаряжение Воронеж'
  }
}

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderExtra />
      <Header />
      <div className="grow">{children}</div>
      <Footer />
    </div>
  )
}
