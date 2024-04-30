import Image from 'next/image'
import styles from './About.module.scss'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function About() {
  return (
    <div className={styles.root}>
      <div className="flex justify-between">
        <Link href="/">
          <Image src="/logo.png" alt="" width={148} height={71} className={styles.logo} />
        </Link>
        <div className={styles.phone}>
          <div className={styles.phoneNumber}>+7 (906) 586-55-55</div>
          <div className={styles.phoneTime}>ежедневно с 10:00 до 18:00</div>
        </div>
      </div>
      <div className={styles.addresses}>
        <div className={styles.address}>
          г. Воронеж, ул. 20 лет Октября 123, ТЦ &quot;Европа&quot;, 4 этаж
        </div>
      </div>
    </div>
  )
}
