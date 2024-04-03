import { Container } from '../Container'
import { TopMenu } from './TopMenu'
import { CitySelect } from './CitySelect'
import styles from './index.module.scss'
import { Sticky } from './Sticky'
import Image from 'next/image'
import { Search } from './Search'
import Link from 'next/link'
import { CatalogButton } from './CatalogButton'
import { Toolbar } from './Toolbar'
import { CatalogMenu } from './CatalogMenu'
import { DesktopContacts } from './DesktopContacts'
import { MobileContacts } from './MobileContacts'
import { cn } from '@/lib/utils'
import { MenuButton } from './MenuButton'

export function Header() {
  console.log('render header')
  return (
    <>
      <div className={styles.top}>
        <Container className={styles['top-container']}>
          <div className={styles['mobile-contacts']}>
            <MobileContacts />
          </div>

          <div className={styles['top-menu-primary']}>
            <TopMenu
              primary={[
                {
                  title: 'Доставка и оплата',
                  href: '/',
                  icon: 'delivery'
                },
                {
                  title: 'Оптовикам',
                  href: '#',
                  icon: 'salers'
                },
                {
                  title: 'Контакты',
                  href: '/contacts',
                  icon: 'contacts'
                },
                {
                  title: 'Блог',
                  href: '#',
                  icon: 'blog',
                  className: 'max-lg:hidden'
                }
              ]}
              secondary={[
                {
                  title: 'Блог',
                  href: '#',
                  className: 'lg:hidden'
                },
                {
                  title: 'О магазине',
                  href: '/'
                },
                {
                  title: 'Скидочные карты',
                  href: '/contacts'
                },
                {
                  title: 'Подарочные сертификаты',
                  href: '#',
                  className: '2xl:hidden'
                },
                {
                  title: 'Школа подводной охоты и дайвинга',
                  href: '#',
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
                  href: '#',
                  icon: 'gift'
                },
                {
                  title: 'Школа подводной охоты и дайвинга',
                  href: '#',
                  icon: 'school'
                }
              ]}
            />
          </div>

          <div className={styles['city-select']}>
            <CitySelect />
          </div>
        </Container>
      </div>
      <Sticky>
        <Container>
          <div className={styles['primary-container']}>
            <div className={styles.logo}>
              <Link href="/">
                <Image src="/logo.png" width={148} height={71} alt="" className='max-md:hidden' />
                <Image src="/small-logo.png" width={43} height={48} alt="" className='md:hidden' />
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

            <div className={styles.toolbar}>
              <Toolbar />
            </div>

            <div className={styles['menu-button']}>
              <MenuButton />
            </div>
          </div>

          <div className={styles['secondary-container']}>
            <div className={styles['catalog-menu']}>
              <CatalogMenu />
            </div>

            <div className={styles['desktop-contacts']}>
              <DesktopContacts />
            </div>
          </div>
        </Container>
      </Sticky>
    </>
  )
}
