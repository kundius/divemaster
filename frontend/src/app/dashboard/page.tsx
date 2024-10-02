import { DashboardPage } from '@/components/admin/DashboardPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Панель управления',
  description:
    'Интернет-магазин подводного снаряжения ДАЙВМАСТЕР. Всё для подводной охоты, дайвинга, плавания - DiveMaster. Предлагаем купить на сайте экипировку оптом и в розницу. Низкие цены в Воронеже, Москве, СПб, Краснодаре, России и других странах мира. Бесплатная доставка.',
  keywords: 'подводное снаряжение, подводная охота, дайвинг, плавание'
}

export default function Page() {
  return <DashboardPage />
}
