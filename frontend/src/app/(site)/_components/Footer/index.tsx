import Link from 'next/link'
import { About } from './About'
import { Bottom } from './Bottom'
import { Menu } from './Menu'
import { Payment } from './Payment'
import { Social } from './Social'
import { Subscribe } from './Subscribe'
import styles from './index.module.css'
import { Container } from '@/components/Container'

export function Footer() {
  return (
    <>
      <div className={styles.root}>
        <Container>
          <div className={styles.grid}>
            <div className={styles.cellAbout}>
              <About />
            </div>
            <div className={styles.cellSubscribe}>
              <Subscribe />
            </div>
            <div className={styles.cellMenuInfo}>
              <Menu
                title="Информация"
                items={[
                  {
                    title: 'О магазине',
                    href: '/info/about'
                  },
                  {
                    title: 'Доставка',
                    href: '/info/delivery'
                  },
                  {
                    title: 'Оплата',
                    href: '/info/payment'
                  },
                  {
                    title: 'Гарантии',
                    href: '/info/guarantee'
                  },
                  {
                    title: 'Как заказать',
                    href: '/info/buy'
                  },
                  {
                    title: 'Скидки',
                    href: '/info/discount'
                  },
                  {
                    title: 'Блог',
                    href: '/blog'
                  }
                ]}
              />
            </div>
            <div className={styles.cellMenuOpt}>
              <Menu
                title="Оптовикам"
                items={[
                  {
                    title: 'Каталог',
                    href: '/catalog'
                  },
                  {
                    title: 'Прайс-лист',
                    href: '/info/wholesalers'
                  },
                  {
                    title: 'Контакты',
                    href: '/contacts'
                  }
                ]}
              />
            </div>
            <div className={styles.cellPayment}>
              <Payment />
            </div>
            <div className={styles.cellSocial}>
              <Social />
            </div>
            <div className={styles.cellStat}>
              <div className="flex items-center justify-between">
                <div className="max-md:hidden" />
                <Link href="/info/site-map" className="text-[#9b9b9b] hover:text-white underline">
                  Карта сайта
                </Link>
                <div></div>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <Bottom />
    </>
  )
}
