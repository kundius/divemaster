'use client'

import { ApiTableData } from '@/lib/ApiTable/types'
import { cn } from '@/lib/utils'
import { CategoryEntity } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import useSWR from 'swr'
import { Container } from '../Container'
import styles from './CatalogButtonContent.module.scss'
import { brands } from './menu'

export default function CatalogButtonContent() {
  const query = useSWR<ApiTableData<CategoryEntity>>([
    `categories`,
    {
      parent: 0,
      limit: 100,
      active: true,
      withChildren: true
    }
  ])

  const spearfishing = query.data?.rows.find((item) => item.alias === 'vsyo-dlya-podvodnoj-ohoty')
  const diving = query.data?.rows.find((item) => item.alias === 'vsyo-dlya-dajvinga')
  const swimming = query.data?.rows.find((item) => item.alias === 'vsyo-dlya-plavaniya')

  return (
    <div className={styles.root}>
      <Container>
        <div className={styles.grid}>
          {spearfishing && (
            <div className={styles['grid-spearfishing']}>
              <Link href={`/category/${spearfishing.alias}`} className={styles.headline}>
                <span className={styles['headline-icon']}>
                  <Image
                    src="/icons/catalog/spearfishing-small.svg"
                    width={48}
                    height={48}
                    alt=""
                  />
                </span>
                <span className={styles['headline-title']}>{spearfishing.title}</span>
              </Link>
              <ul className={cn(styles.list, 'max-lg:columns-1 columns-2 gap-12')}>
                {spearfishing.children?.map((item) => (
                  <li key={item.id}>
                    <Link href={`/category/${item.alias}`}>{item.title}</Link>
                  </li>
                ))}
                <li className={styles['spearfishing-spacer']}></li>
              </ul>
            </div>
          )}
          {diving && (
            <div className={styles['grid-diving']}>
              <Link href={`/category/${diving.alias}`} className={styles.headline}>
                <span className={styles['headline-icon']}>
                  <Image src="/icons/catalog/diving-small.svg" width={55} height={50} alt="" />
                </span>
                <span className={styles['headline-title']}>{diving.title}</span>
              </Link>
              <ul className={cn(styles.list, 'max-lg:columns-1 max-xl:columns-2')}>
                {diving.children?.map((item) => (
                  <li key={item.id}>
                    <Link href={`/category/${item.alias}`}>{item.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className={styles['grid-brands']}>
            <Link href="#Бренды" className={styles.headline}>
              <span className={styles['headline-icon']}>
                <Image src="/icons/catalog/brands-small.svg" width={55} height={31} alt="" />
              </span>
              <span className={styles['headline-title']}>Бренды</span>
            </Link>
            <ul className={cn(styles.list, 'max-lg:columns-4 max-xl:columns-6 columns-2 gap-12')}>
              {brands.map((item, i) => (
                <li key={i}>
                  <Link href={item.href}>{item.title}</Link>
                </li>
              ))}
            </ul>
          </div>
          {swimming && (
            <div className={styles['grid-swimming']}>
              <Link href={`/category/${swimming.alias}`} className={styles.headline}>
                <span className={styles['headline-icon']}>
                  <Image src="/icons/catalog/swimming-small.svg" width={62} height={52} alt="" />
                </span>
                <span className={styles['headline-title']}>{swimming.title}</span>
              </Link>
            </div>
          )}
          <div className={styles['grid-sale']}>
            <Link href={'#Товары со скидкой'} className={styles.headline}>
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
