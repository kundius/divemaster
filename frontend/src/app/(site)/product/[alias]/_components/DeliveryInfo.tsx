import Link from 'next/link'
import styles from './DeliveryInfo.module.scss'

export function DeliveryInfo() {
  return (
    <div className={styles.items}>
      <div className={styles.item}>
        <div className={styles.icon}>
          <svg viewBox="0 0 32 36" width="32" height="36">
            <use href="/sprite.svg#self-pickup"></use>
          </svg>
        </div>
        <div className={styles.content}>
          <div className={styles.headline}>
            <div className={styles.title}>Самовывоз</div>
            <div className={styles.action}>В наличии на складе</div>
          </div>
          <div className={styles.text}>Из магазина, пункта выдачи или постамата</div>
        </div>
      </div>
      <div className={styles.item}>
        <div className={styles.icon}>
          <svg viewBox="0 0 38 38" width="38" height="38">
            <use href="/sprite.svg#delivery"></use>
          </svg>
        </div>
        <div className={styles.content}>
          <div className={styles.headline}>
            <div className={styles.title}>Доставка</div>
            <Link href="/info/delivery-and-payment" className={styles.action} target="_blank">
              Варианты доставки
            </Link>
          </div>
          <div className={styles.text}>Курьером до вашей двери</div>
        </div>
      </div>
    </div>
  )
}
