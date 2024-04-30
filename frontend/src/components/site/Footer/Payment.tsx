import Image from 'next/image'
import styles from './Payment.module.scss'

export function Payment() {
  return (
    <div className={styles.root}>
      <div className={styles.title}>Способы оплаты</div>
      <div className={styles.icons}>
        <Image src="/payments-icons.png" alt="" width={176} height={24} />
      </div>
      <div className={styles.description}>
        Вы можете оплатить покупки наличными при получении, либо выбрать другой способ оплаты
      </div>
    </div>
  )
}
