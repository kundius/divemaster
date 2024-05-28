import { ApiTableData } from '@/components/lib/ApiTable/types'
import { apiGet } from '@/lib/api'
import { cn } from '@/lib/utils'
import { CategoryEntity } from '@/types'
import Link from 'next/link'
import styles from './CatalogMenu.module.scss'

export async function CatalogMenu() {
  const data = await apiGet<ApiTableData<CategoryEntity>>('categories', {
    active: true,
    parent: 0,
    all: 1,
    populate: ['children']
  })

  return (
    <ul className={styles.first}>
      {data.rows.map((item) => (
        <li className={styles['first-item']} key={item.id}>
          <Link href={`/category/${item.alias}`} className={styles['first-link']}>
            {item.title}
          </Link>
          {(item.children || []).length > 0 && (
            <ul className={cn(styles.second, 'gap-8 columns-3')}>
              {(item.children || []).map((item) => (
                <li key={item.id} className={styles['second-item']}>
                  <Link href={`/category/${item.alias}`} className={styles['second-link']}>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
      {/* <li className={cn(styles['first-item'], 'max-lg:hidden')}>
        <Link href="#Бренды" className={styles['first-link']}>
          Бренды
        </Link>
        <ul className={cn(styles.second, styles['second-brands'], 'gap-8 columns-4')}>
          {brands.map((item, i) => (
            <li key={i} className={styles['second-item']}>
              <Link href={item.href} className={styles['second-link']}>
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </li> */}
      {/* <li className={cn(styles['first-item'], 'max-lg:hidden')}>
        <Link href="#" className={styles.sale}>
          <span className="sale" />
        </Link>
      </li> */}
    </ul>
  )
}
