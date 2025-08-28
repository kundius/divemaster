import Image from 'next/image'
import styles from './Discount.module.css'
import { AuthButton } from './AuthButton'

export function Discount() {
  return (
    <div className={styles.root}>
      <div className={styles.bg} data-parallax={''}>
        <Image
          src="/hero/Discount/bg.jpg"
          width={2000}
          height={850}
          loading="eager"
          alt=""
          sizes="100vw"
          quality={90}
          className="max-sm:hidden"
        />
        <Image
          src="/hero/Discount/bg-sm.jpg"
          width={2000}
          height={850}
          loading="eager"
          alt=""
          sizes="100vw"
          quality={90}
          className="sm:hidden"
        />
      </div>
      <div className={styles.content}>
        <div className={styles.title}>Покупайте выгодно!</div>
        <div className={styles.desc}>
          При первой покупке в нашем магазине Вы&nbsp;получаете
          <span>накопительную&nbsp;скидочную&nbsp;карту</span>. Совершая покупки по&nbsp;карте
          «DiveMaster», Вы увеличиваете свою персональную скидку.
        </div>
        <AuthButton />
      </div>
    </div>
  )
}
