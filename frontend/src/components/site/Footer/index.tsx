import { Container } from '../Container'
import { About } from './About'
import { Bottom } from './Bottom'
import { Menu } from './Menu'
import { Payment } from './Payment'
import { Social } from './Social'
import { Subscribe } from './Subscribe'
import styles from './index.module.scss'

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
                    title: 'Каталог',
                    href: '#'
                  },
                  {
                    title: 'О магазине',
                    href: '#'
                  },
                  {
                    title: 'Бренды',
                    href: '#'
                  },
                  {
                    title: 'Доставка и оплата',
                    href: '#'
                  },
                  {
                    title: 'Возврат и обмен',
                    href: '#'
                  },
                  {
                    title: 'Скидки',
                    href: '#'
                  },
                  {
                    title: 'Блог',
                    href: '#'
                  }
                ]}
              />
            </div>
            <div className={styles.cellMenuOpt}>
              <Menu
                title="Оптовикам"
                items={[
                  {
                    title: 'Прайс-лист',
                    href: '#'
                  },
                  {
                    title: 'Контакты',
                    href: '#'
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
                <a href="#" className="text-[#9b9b9b] hover:text-white underline">
                  Карта сайта
                </a>
                <div>Counters</div>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <Bottom />
    </>
  )
}
