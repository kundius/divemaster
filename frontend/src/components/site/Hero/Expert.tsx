import Image from 'next/image'
import styles from './Expert.module.scss'

export function Expert() {
  return (
    <div className={styles.root}>
      <div className={styles.bg} data-parallax={''}>
        <Image
          src="/hero/Expert/bg.jpg"
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
