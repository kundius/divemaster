import Image from 'next/image'
import styles from './CatalogButtonContent.module.scss'
import Link from 'next/link'
import { catalogByDirection } from './menu'
import { Container } from '../Container'
import { cn } from '@/lib/utils'

export default function CatalogButtonContent() {
  return (
    <div className={styles.root}>
      <Container>
        <div className={styles.grid}>
          <div className={styles['grid-spearfishing']}>
            <Link href={'#'} className={styles.headline}>
              <span className={styles['headline-icon']}>
                <Image src="/icons/catalog/spearfishing-small.svg" width={48} height={48} alt="" />
              </span>
              <span className={styles['headline-title']}>{catalogByDirection[0].title}</span>
            </Link>
            <ul className={cn(styles.list, 'max-lg:columns-1 columns-2 gap-12')}>
              {catalogByDirection[0].items.map((item, i) => (
                <li key={i}>
                  <Link href={item.href}>{item.title}</Link>
                </li>
              ))}
              <li className={styles['spearfishing-spacer']}></li>
            </ul>
          </div>
          <div className={styles['grid-diving']}>
            <Link href={'#'} className={styles.headline}>
              <span className={styles['headline-icon']}>
                <Image src="/icons/catalog/diving-small.svg" width={55} height={50} alt="" />
              </span>
              <span className={styles['headline-title']}>{catalogByDirection[1].title}</span>
            </Link>
            <ul className={cn(styles.list, 'max-lg:columns-1 max-xl:columns-2')}>
              {catalogByDirection[1].items.map((item, i) => (
                <li key={i}>
                  <Link href={item.href}>{item.title}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles['grid-brands']}>
            <Link href={'#'} className={styles.headline}>
              <span className={styles['headline-icon']}>
                <Image src="/icons/catalog/brands-small.svg" width={55} height={31} alt="" />
              </span>
              <span className={styles['headline-title']}>{catalogByDirection[3].title}</span>
            </Link>
            <ul className={cn(styles.list, 'max-lg:columns-4 max-xl:columns-6 columns-2 gap-12')}>
              {catalogByDirection[3].items.map((item, i) => (
                <li key={i}>
                  <Link href={item.href}>{item.title}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles['grid-swimming']}>
            <Link href={'#'} className={styles.headline}>
              <span className={styles['headline-icon']}>
                <Image src="/icons/catalog/swimming-small.svg" width={62} height={52} alt="" />
              </span>
              <span className={styles['headline-title']}>{catalogByDirection[2].title}</span>
            </Link>
          </div>
          <div className={styles['grid-sale']}>
            <Link href={'#'} className={styles.headline}>
              <span className={styles['headline-icon']}>
                <span className="sale" />
              </span>
              <span className={styles['headline-title']}>Товары со скидкой</span>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  )
}
