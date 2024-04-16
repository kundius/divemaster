import Image from 'next/image'
import styles from './Discount.module.scss'

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
        />
      </div>
    </div>
  )
}
