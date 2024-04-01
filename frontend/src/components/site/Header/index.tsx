import Image from 'next/image'
import { Container } from '../Container'
import { TopMenu } from './TopMenu'
import { CitySelect } from './CitySelect'
// import { SecondGroup } from './SecondGroup'
// import { ThirdGroup } from './ThirdGroup'
import styles from './styles.module.scss'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Header() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.firstGroupWrapper}>
        <Container>
          <div className={styles.firstGroup}>
            <TopMenu
              primary={[
                {
                  title: 'Доставка и оплата',
                  href: '#',
                  icon: 'delivery'
                },
                {
                  title: 'Оптовикам',
                  href: '#',
                  icon: 'salers'
                },
                {
                  title: 'Контакты',
                  href: '#',
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
                  href: '#'
                },
                {
                  title: 'Скидочные карты',
                  href: '#'
                }
              ]}
            />
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
            <CitySelect />
          </div>
        </Container>
      </div>
      <div className={styles.secondGroupWrapper}>
        <Container>
          <div className={styles.secondGroup}>secondGroup</div>
        </Container>
      </div>
      <div className={styles.thirdGroupWrapper}>
        <Container>
          <div className={styles.thirdGroup}>thirdGroup</div>
        </Container>
      </div>
    </div>
  )
}
