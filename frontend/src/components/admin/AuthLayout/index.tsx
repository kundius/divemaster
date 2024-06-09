import { PropsWithChildren } from 'react'
import styles from './styles.module.scss'
import Link from 'next/link'
import Image from 'next/image'

export function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Link href="/">
          <Image src="/logo.png" alt="Divemaster Logo" width={148} height={71} priority />
        </Link>
      </div>
      <div className={styles.body}>
        <div>{children}</div>
      </div>
      <div className={styles.footer}>
      <div className={styles.copyright}>
        © 2008-{(new Date()).getFullYear()} &ldquo;ДАЙВМАСТЕР&rdquo;. Все права защищены
      </div>
      <div className={styles.links}>
        {/* <Link href="/">Ползовательское соглашение</Link> <Link href="/">Политика конфиденциальности</Link> */}
      </div>
      </div>
    </div>
  )
}
