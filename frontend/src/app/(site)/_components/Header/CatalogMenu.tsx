import { apiGet } from '@/lib/api'
import { arrayToTree, cn } from '@/lib/utils'
import { BrandEntity, CategoryEntity, FindAllResult } from '@/types'
import Link from 'next/link'
import styles from './CatalogMenu.module.css'

export async function CatalogMenu() {
  const [categories, brands] = await Promise.all([
    apiGet<FindAllResult<CategoryEntity>>('categories', { limit: 100 }),
    apiGet<FindAllResult<BrandEntity>>('brands', { limit: 100 })
  ])

  const categoriesTree = arrayToTree<CategoryEntity>(categories.rows)

  return (
    <ul className={styles.first}>
      {categoriesTree.map((item) => (
        <li className={styles['first-item']} key={item.id}>
          <Link href={`/category/${item.alias}`} className={styles['first-link']}>
            {item.title}
          </Link>
          {(item.children || []).length > 0 && (
            <ul className={cn(styles.second)}>
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
      <li className={cn(styles['first-item'], 'max-lg:hidden')}>
        <span className={styles['first-link']}>Бренды</span>
        <ul className={cn(styles.second, styles['second-brands'])}>
          {brands.rows.map((n, i) => (
            <li key={i} className={styles['second-item']}>
              <Link href={`/brand/${n.alias}`} className={styles['second-link']}>
                {n.name}
              </Link>
            </li>
          ))}
        </ul>
      </li>
      {/* <li className={cn(styles['first-item'], 'max-lg:hidden')}>
        <Link href="#" className={styles.sale}>
          <span className="sale" />
        </Link>
      </li> */}
    </ul>
  )
}
