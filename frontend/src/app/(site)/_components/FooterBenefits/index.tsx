import Image from 'next/image'
import { Container } from '../../../../components/Container'
import styles from './index.module.css'

export function FooterBenefits() {
  return (
    <div className={styles.root}>
      <Container>
        <div className={styles.list}>
          <div className={styles.item}>
            <div className={styles.icon}>
              <Image src="/footer-benefits/1.svg" alt="" width={60} height={60} />
            </div>
            <div className={styles.title}>
              Накопительная скидка
              <br /> с первой покупки
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.icon}>
              <Image src="/footer-benefits/2.svg" alt="" width={60} height={60} />
            </div>
            <div className={styles.title}>
              Не подошел товар?
              <br />
              Возврат или обмен в течении 21 дня!
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.icon}>
              <Image src="/footer-benefits/3.svg" alt="" width={60} height={60} />
            </div>
            <div className={styles.title}>
              Бесплатная доставка по всей
              <br /> России при заказе от 5 000 ₽
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
