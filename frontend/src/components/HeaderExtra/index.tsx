import { Container } from '../site/Container'
import { CitySelect } from './CitySelect'
import styles from './index.module.scss'
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
                  title: 'Доставка и оплата',
                  href: '/info/delivery-and-payment',
                  icon: 'delivery'
                },
                {
                  title: 'Оптовикам',
                  href: '/info/wholesalers',
                  icon: 'salers'
                },
                {
                  title: 'Контакты',
                  href: '/contacts',
                  icon: 'contacts'
                },
                {
                  title: 'Блог',
                  href: '/blog',
                  icon: 'blog',
                  className: 'max-lg:hidden'
                }
              ]}
              secondary={[
                {
                  title: 'Блог',
                  href: '/blog',
                  className: 'lg:hidden'
                },
                {
                  title: 'О магазине',
                  href: '/info/about'
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
