'use client'

import { ApiTableData } from '@/lib/ApiTable/types'
import {
  VerticalMenu,
  VerticalMenuItem,
  VerticalMenuLink,
  VerticalMenuList,
  VerticalMenuTrigger
} from '@/components/ui/vertical-menu'
import { CategoryEntity } from '@/types'
import useSWR from 'swr'
import styles from './MobileNavigationCatalog.module.scss'
import { arrayToTree } from '@/lib/utils'

export default function MobileNavigationCatalog() {
  const query = useSWR<ApiTableData<CategoryEntity>>([
    `categories`,
    {
      limit: 100,
      active: true
    }
  ])
  
  const categories = arrayToTree<CategoryEntity>(query.data?.rows || [])

  return (
    <div className={styles.root}>
      <VerticalMenu>
        <VerticalMenuList>
          {categories.map((item) => (
            <VerticalMenuItem key={item.id}>
              {(item.children || []).length > 0 ? (
                <>
                  <VerticalMenuTrigger>{item.title}</VerticalMenuTrigger>
                  <VerticalMenuList>
                    {(item.children || []).map((item) => (
                      <VerticalMenuItem key={item.id}>
                        <VerticalMenuLink href={`/category/${item.alias}`}>
                          {item.title}
                        </VerticalMenuLink>
                      </VerticalMenuItem>
                    ))}
                  </VerticalMenuList>
                </>
              ) : (
                <VerticalMenuLink href={`/category/${item.alias}`}>{item.title}</VerticalMenuLink>
              )}
            </VerticalMenuItem>
          ))}
          {/* <VerticalMenuItem>
            <VerticalMenuTrigger>Бренды</VerticalMenuTrigger>
            <VerticalMenuList>
              {diving.map((item, i) => (
                <VerticalMenuItem key={i}>
                  <VerticalMenuLink href={item.href}>{item.title}</VerticalMenuLink>
                </VerticalMenuItem>
              ))}
            </VerticalMenuList>
          </VerticalMenuItem> */}
          {/* <VerticalMenuItem>
            <Link href={`#sale`} className={styles.sale}>
              <span className="sale" />
            </Link>
          </VerticalMenuItem> */}
        </VerticalMenuList>
      </VerticalMenu>
      {/* <Link href="#" className={styles.gift}>
        Подарочный сертификат
      </Link> */}
    </div>
  )
}
