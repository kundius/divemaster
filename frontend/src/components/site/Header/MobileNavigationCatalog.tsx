import { byDirection } from '@/categories'
import {
  VerticalMenu,
  VerticalMenuArrow,
  VerticalMenuItem,
  VerticalMenuList,
  VerticalMenuTrigger
} from '@/components/ui/vertical-menu'
import { useRef } from 'react'
import styles from './MobileNavigationCatalog.module.scss'

export default function MobileNavigationCatalog() {
  return (
    <div className={styles.root}>
      <VerticalMenu>
        <VerticalMenuList>
          {byDirection.map((item, i) => (
            <VerticalMenuItem key={i}>
              <VerticalMenuTrigger href={item.href}>
                {item.title}
                {item.items.length > 0 && <VerticalMenuArrow />}
              </VerticalMenuTrigger>
              {item.items.length > 0 && (
                <VerticalMenuList>
                  {item.items.map((sub, k) => (
                    <VerticalMenuItem key={k}>
                      <VerticalMenuTrigger href={sub.href}>{sub.title}</VerticalMenuTrigger>
                    </VerticalMenuItem>
                  ))}
                </VerticalMenuList>
              )}
            </VerticalMenuItem>
          ))}
        </VerticalMenuList>
      </VerticalMenu>
    </div>
  )
}
