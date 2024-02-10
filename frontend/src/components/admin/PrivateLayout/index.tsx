import Image from 'next/image'
import { PropsWithChildren } from 'react'
import styles from './styles.module.scss'
import { Navigation } from '../Navigation'
import Link from 'next/link'
import { Headline } from '../Headline'
import { Footer } from '../Footer'

export async function PrivateLayout({ children }: PropsWithChildren) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.layout}>
          <div className={styles.sidebar}>
            <div className="sticky top-0">
              <div className={styles.logo}>
                <Link href="/admin">
                  <Image src="/logo.png" alt="Divemaster Logo" width={148} height={71} priority />
                </Link>
              </div>

              <Navigation />
            </div>
          </div>
          <div className={styles.body}>
            <Headline />

            <div className="p-3 lg:p-8 flex-grow">{children}</div>

            <Footer />
          </div>
        </div>
      </div>
    </div>
  )
}
