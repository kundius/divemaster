import { Container } from '../site/Container'
import { CitySelect } from './CitySelect'
import styles from './index.module.css'
import { MobileContacts } from './MobileContacts'
import { TopMenu } from './TopMenu'

export function HeaderExtra() {
  return (
    <div className={styles.top}>
      <Container>
        <div className={styles['top-container']}>
          <div className={styles['mobile-contacts']}>
            <MobileContacts />
          </div>

          <div className={styles['top-menu-primary']}>
            <TopMenu
              primary={[
                {
                  title: 'Доставка',
                  href: '/info/delivery',
                  icon: 'delivery'
                },
                {
                  title: 'Оплата',
                  href: '/info/payment',
                  icon: 'wallet'
                },
                {
                  title: 'Гарантии',
                  href: '/info/guarantee',
                  icon: 'guarantee'
                },
                {
                  title: 'Контакты',
                  href: '/contacts',
                  icon: 'marker'
                },
                {
                  title: 'Блог',
                  href: '/blog',
                  icon: 'comments'
                }
              ]}
              secondary={[
                {
                  title: 'О магазине',
                  href: '/info/about'
                },
                {
                  title: 'Оптовикам',
                  href: '/info/wholesalers'
                },
                {
                  title: 'Как сделать заказ',
                  href: '/info/buy'
                },
                {
                  title: 'Скидочные карты',
                  href: '/info/discount'
                },
                {
                  title: 'Подарочные сертификаты',
                  href: '/info/gift-certificates',
                  className: '2xl:hidden'
                },
                {
                  title: 'Школа подводной охоты и дайвинга',
                  href: '/info/school',
                  className: '2xl:hidden'
                }
              ]}
            />
          </div>

          <div className={styles['top-menu-secondary']}>
            <TopMenu
              primary={[
                {
                  title: 'Подарочные сертификаты',
                  href: '/info/gift-certificates',
                  icon: 'gift'
                },
                {
                  title: 'Школа подводной охоты и дайвинга',
                  href: '/info/school',
                  icon: 'school'
                }
              ]}
            />
          </div>

          <div className={styles['city-select']}>
            <CitySelect />
          </div>
        </div>
      </Container>
    </div>
  )
}
