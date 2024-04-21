import Image from 'next/image'
import styles from './Discount.module.scss'

export function Discount() {
  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <div className={styles.title}>Увеличивайте скидку</div>
        <div className={styles.desc}>
          При первой покупке в нашем магазине Вы получаете накопительную{' '}
          <span>скидочную карту</span>. Совершая покупки по карте «DiveMaster», Вы увеличиваете
          персональную скидку.
        </div>
        <div className={styles.action}>
          <a href="#" className={styles.button}>
            Узнать больше
            <span className={styles.buttonArrow} />
          </a>
        </div>
      </div>
      <Image
        className={styles.image}
        src="/benefits/discount.png"
        width={1920}
        height={664}
        alt="Увеличивайте скидку"
      />
    </div>
  )
}
