import Image from 'next/image'
import styles from './Expert.module.css'

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
          className="max-sm:hidden"
        />
        <Image
          src="/hero/Expert/bg-sm.jpg"
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
        <div className={styles.label}>Комплект для PRO</div>
        <div className={styles.title}>Эксперты рекомендуют</div>
      </div>
    </div>
  )
}
