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
          className="max-sm:hidden"
        />
        <Image
          src="/hero/Spearfishing/bg-sm.jpg"
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
        <div className={styles.salvimar} />
        <div className={styles.title}>
        Для настоящего<br />
        «подвоха»
        </div>
        <div className={styles.desc}>
        С классикой от легендарного бренда удачная охота гарантирована
        </div>
        <a href="#" className={styles.button}>
          Перейти к товарам
        </a>
      </div>
    </div>
  )
}
