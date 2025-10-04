'use client'

import {
  VerticalMenu,
  VerticalMenuItem,
  VerticalMenuLink,
  VerticalMenuList
} from '@/components/ui/vertical-menu'
import { arrayToTree } from '@/lib/utils'
import { BrandEntity, CategoryEntity, FindAllResult } from '@/types'
import useSWR from 'swr'

export default function MobileNavigationCatalog() {
  const query = useSWR<FindAllResult<CategoryEntity>>([`categories`, { limit: 100 }])
  const queryBrands = useSWR<FindAllResult<BrandEntity>>([`brands`, { limit: 100 }])
  const categories = arrayToTree<CategoryEntity>(query.data?.rows || [])

  return (
    <VerticalMenu>
      <VerticalMenuList>
        {categories.map((item) => (
          <VerticalMenuItem key={item.id}>
            <VerticalMenuLink href={`/category/${item.alias}`}>{item.title}</VerticalMenuLink>
            {(item.children || []).length > 0 && (
              <VerticalMenuList>
                {(item.children || []).map((item) => (
                  <VerticalMenuItem key={item.id}>
                    <VerticalMenuLink href={`/category/${item.alias}`}>
                      {item.title}
                    </VerticalMenuLink>
                  </VerticalMenuItem>
                ))}
              </VerticalMenuList>
            )}
          </VerticalMenuItem>
        ))}
        {queryBrands.data && (
          <VerticalMenuItem>
            <VerticalMenuLink>Бренды</VerticalMenuLink>
            <VerticalMenuList>
              {queryBrands.data.rows.map((n, i) => (
                <VerticalMenuItem key={i}>
                  <VerticalMenuLink href={`/brand/${n.alias}`}>{n.name}</VerticalMenuLink>
                </VerticalMenuItem>
              ))}
            </VerticalMenuList>
          </VerticalMenuItem>
        )}
        {/* <VerticalMenuItem>
            <Link href={`#sale`} className={styles.sale}>
              <span className="sale" />
            </Link>
          </VerticalMenuItem> */}
      </VerticalMenuList>
    </VerticalMenu>
  )
}
