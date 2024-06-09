import Image from 'next/image'
import Link from 'next/link'
import { Container } from '../Container'
import { CatalogButton } from './CatalogButton'
import { CatalogMenu } from './CatalogMenu'
import { CitySelect } from './CitySelect'
import { DesktopContacts } from './DesktopContacts'
import { MenuButton } from './MenuButton'
import { MobileContacts } from './MobileContacts'
import { MobileNavigation } from './MobileNavigation'
import { Search } from './Search'
import { Sticky } from './Sticky'
import { Toolbar } from './Toolbar'
import { TopMenu } from './TopMenu'
import styles from './index.module.scss'

export function Header() {
  return (
    <MobileNavigation>
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
      <Sticky>
        <Container>
          <div className={styles['primary-container']} data-header-primary="">
            <div className={styles.logo}>
              <Link href="/">
                <Image src="/logo.png" width={148} height={71} alt="" className="max-md:hidden" />
                <Image src="/small-logo.png" width={43} height={48} alt="" className="md:hidden" />
              </Link>
            </div>

            <div className={styles['catalog-button']}>
              <CatalogButton />
            </div>

            <div className={styles.space1} />

            <div className={styles.search}>
              <Search />
            </div>

            <div className={styles.space2} />

            <div className={styles.toolbar} data-header-toolbar="">
              <Toolbar />
            </div>

            <div className={styles['menu-button']}>
              <MenuButton />
            </div>
          </div>

          <div className={styles['secondary-container']} data-header-secondary="">
            <div className={styles['catalog-menu']}>
              <CatalogMenu />
            </div>

            <div className={styles['desktop-contacts']}>
              <DesktopContacts />
            </div>
          </div>
        </Container>
      </Sticky>
    </MobileNavigation>
  )
}
