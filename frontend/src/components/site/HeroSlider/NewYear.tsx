import Image from 'next/image'
import styles from './NewYear.module.scss'
import Link from 'next/link'

export function NewYear() {
  return (
    <div className={styles.root}>
      <div className={styles.bg} data-parallax={''}>
        <Image
          src="/hero/NewYear/bg.jpg"
          width={2000}
          height={850}
          loading="eager"
          alt=""
          sizes="100vw"
          quality={90}
          className="max-sm:hidden"
        />
        <Image
          src="/hero/NewYear/bg-sm.jpg"
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
        <div className={styles.title}>
          Готовимся
          <br />к новому году!
        </div>
        <div className={styles.desc}>
          Готовь сани летом, а новогодний отпуск сейчас - выгодные предложения и скидки на товары
          любимых брендов
        </div>
        <Link href="/auth/signin" className={styles.button}>
          Авторизоваться
        </Link>
        <div className={styles.price}>
          <div className={styles['price-label']}>
            скидки до
          </div>
          <div className={styles['price-value']}>
            <span>-</span>40%
          </div>
        </div>
      </div>
    </div>
  )
}
