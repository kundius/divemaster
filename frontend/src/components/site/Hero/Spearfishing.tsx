import Image from 'next/image'
import styles from './Spearfishing.module.scss'

export function Spearfishing() {
  return (
    <div className={styles.root}>
      <div className={styles.bg} data-parallax={''}>
        <Image
          src="/hero/Spearfishing/bg.jpg"
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
