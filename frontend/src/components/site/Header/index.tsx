import { Container } from '../Container'
// import { HelpMenu } from './HelpMenu'
import { CitySelect } from './CitySelect'
// import { SecondGroup } from './SecondGroup'
// import { ThirdGroup } from './ThirdGroup'
import styles from './styles.module.scss'
import Link from 'next/link'

export function Header() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.firstGroupWrapper}>
        <Container>
          <div className={styles.firstGroup}>
            {/* <HelpMenu /> */}
            <ul className={styles.helpMenu}>
              <li>
                <Link href="#">Доставка и оплата</Link>
              </li>
              <li>
                <Link href="#">Оптовикам</Link>
              </li>
              <li>
                <Link href="#">Контакты</Link>
              </li>
              <li className='max-lg:hidden'>
                <Link href="#">Блог</Link>
              </li>
              <li className={styles.helpMenuMore}>
                <button className={styles.helpMenuMoreToggle}></button>
                <ul className={styles.helpMenuMoreList}>
                  <li className='lg:hidden'>
                    <Link href="#">Блог</Link>
                  </li>
                  <li>
                    <Link href="#">О магазине</Link>
                  </li>
                  <li>
                    <Link href="#">Скидочные карты</Link>
                  </li>
                </ul>
              </li>
            </ul>
            <ul className={styles.helpMenu}>
              <li>
                <Link href="#">Подарочные сертификаты</Link>
              </li>
              <li>
                <Link href="#">Школа подводной охоты и дайвинга</Link>
              </li>
            </ul>
            <CitySelect />
          </div>
        </Container>
      </div>
      <div className={styles.secondGroupWrapper}>
        <Container>
          <div className={styles.secondGroup}></div>
        </Container>
      </div>
      <div className={styles.thirdGroupWrapper}>
        <Container>
          <div className={styles.thirdGroup}></div>
        </Container>
      </div>
    </div>
  )
}
