import {
  VerticalMenu,
  VerticalMenuItem,
  VerticalMenuLink,
  VerticalMenuList,
  VerticalMenuTrigger
} from '@/components/ui/vertical-menu'
import Link from 'next/link'
import styles from './MobileNavigationCatalog.module.scss'
import { spearfishing, brands, diving } from './menu'
import { apiGet } from '@/lib/api'
import { CategoryEntity } from '@/types'

export default async function MobileNavigationCatalog() {
  const data = await apiGet<CategoryEntity[]>('categories/tree', { active: true })
  return (
    <div className={styles.root}>
      <VerticalMenu>
        <VerticalMenuList>
          {data.map((item) => (
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
