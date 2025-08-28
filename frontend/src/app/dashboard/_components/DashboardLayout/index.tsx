import Image from 'next/image'
import { PropsWithChildren } from 'react'
import Link from 'next/link'

import styles from './index.module.css'
import { Navigation } from './Navigation'
import { User } from './User'
import { Header } from './Header'
import { Branding } from './Branding'

export async function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <Header />

        <div className={styles.layout}>
          <div className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <Branding />
              {/* <div className={styles.logo}>
                <Link href="/">
                  <Image src="/logo.png" alt="Divemaster Logo" width={148} height={71} priority />
                </Link>
              </div> */}
            </div>

            <div className={styles.sidebarBody}>
              <Navigation />
            </div>

            <div className={styles.sidebarFooter}>
              <User />
            </div>
          </div>

          <div className={styles.body}>{children}</div>
        </div>
      </div>
    </div>
  )
}
