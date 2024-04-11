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

export default function MobileNavigationCatalog() {
  return (
    <div className={styles.root}>
      <VerticalMenu>
        <VerticalMenuList>
          <VerticalMenuItem>
            <VerticalMenuTrigger>Всё для подводной охоты</VerticalMenuTrigger>
            <VerticalMenuList>
              {spearfishing.map((item, i) => (
                <VerticalMenuItem key={i}>
                  <VerticalMenuLink href={item.href}>{item.title}</VerticalMenuLink>
                </VerticalMenuItem>
              ))}
            </VerticalMenuList>
          </VerticalMenuItem>
          <VerticalMenuItem>
            <VerticalMenuTrigger>Всё для дайвинга</VerticalMenuTrigger>
            <VerticalMenuList>
              {diving.map((item, i) => (
                <VerticalMenuItem key={i}>
                  <VerticalMenuLink href={item.href}>{item.title}</VerticalMenuLink>
                </VerticalMenuItem>
              ))}
            </VerticalMenuList>
          </VerticalMenuItem>
          <VerticalMenuItem>
            <VerticalMenuLink href="#Все для плавания">Все для плавания</VerticalMenuLink>
          </VerticalMenuItem>
          <VerticalMenuItem>
            <VerticalMenuTrigger>Бренды</VerticalMenuTrigger>
            <VerticalMenuList>
              {diving.map((item, i) => (
                <VerticalMenuItem key={i}>
                  <VerticalMenuLink href={item.href}>{item.title}</VerticalMenuLink>
                </VerticalMenuItem>
              ))}
            </VerticalMenuList>
          </VerticalMenuItem>
          <VerticalMenuItem>
            <Link href={`#sale`} className={styles.sale}>
              <span className="sale" />
            </Link>
          </VerticalMenuItem>
        </VerticalMenuList>
      </VerticalMenu>
      <Link href="#" className={styles.gift}>
        Подарочный сертификат
      </Link>
    </div>
  )
}
