import Image from 'next/image'
import styles from './About.module.css'
import Link from 'next/link'

export function About() {
  return (
    <div className={styles.root} itemScope itemType="https://schema.org/LocalBusiness">
      <meta itemProp="name" content="Название компании" />
      <link itemProp="logo" href={`${process.env.NEXT_PUBLIC_CLIENT_URL}logo.png`} />
      <link itemProp="url" href={process.env.NEXT_PUBLIC_CLIENT_URL} />

      <div className="flex items-center justify-between">
        <Link href="/">
          <Image src="/logo.png" alt="" width={148} height={71} className={styles.logo} />
        </Link>
        <div className={styles.phone}>
          <div className={styles.phoneNumber} itemProp="telephone">
            +78007000354
          </div>
          <time className={styles.phoneTime} itemProp="openingHours" dateTime="Mo-Su 10:00-18:00">
            ежедневно с 10:00 до 18:00
          </time>
        </div>
      </div>
      <div
        className={styles.addresses}
        itemProp="address"
        itemScope
        itemType="https://schema.org/PostalAddress"
      >
        <div className={styles.address}>
          <span itemProp="addressLocality">г. Воронеж</span>,{' '}
          <span itemProp="streetAddress">
            ул. 20 лет Октября 123, ТЦ &quot;Европа&quot;, 4 этаж
          </span>
        </div>
      </div>
    </div>
  )
}
