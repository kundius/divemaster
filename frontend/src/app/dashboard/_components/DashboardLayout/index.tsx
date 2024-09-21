import Image from 'next/image'
import { PropsWithChildren } from 'react'
import Link from 'next/link'

import styles from './index.module.scss'
import { Navigation } from './Navigation'
import { Footer } from './Footer'
import { User } from './User'
import { Header } from './Header'

export async function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <Header />

        <div className={styles.layout}>
          <div className={styles.sidebar}>
            <div className={styles.sidesticky}>
              <div className={styles.logo}>
                <Link href="/dashboard">
                  <Image src="/logo.png" alt="Divemaster Logo" width={148} height={71} priority />
                </Link>
              </div>

              <Navigation />
            </div>

            <div className={styles.sidefloat}>
              <User />
            </div>
          </div>

          <div className={styles.body}>{children}</div>
        </div>
      </div>
    </div>
  )
}
