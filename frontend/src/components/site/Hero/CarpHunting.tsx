import { Container } from '../Container'
import styles from './CarpHunting.module.scss'
import Image from 'next/image'

export function CarpHunting() {
  return (
    <div className={styles.root}>
      <div className={styles.bg} data-parallax={''}>
        <Image src="/hero/CarpHunting/bg.jpg" width={2000} height={850} loading="eager" alt="" />
      </div>
      <div className={styles.content}>
        <a href="#" className={styles.label}>
          Всё для подводной охоты
        </a>
        <div className={styles.title}>Охота на карпа</div>
        <div className={styles.links}>
          <a href="#">пневматические подводные ружья</a>
          <a href="#">аксессуары</a>
        </div>
        <a href="#" className={styles.button}>
          смотреть видео
        </a>
      </div>
    </div>
  )
}
