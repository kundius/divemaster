import {
  VerticalMenu,
  VerticalMenuItem,
  VerticalMenuLink,
  VerticalMenuList,
  VerticalMenuTrigger
} from '@/components/ui/vertical-menu'
import styles from './MobileNavigationPages.module.scss'

export default function MobileNavigationPages() {
  return (
    <div className={styles.root}>
      <VerticalMenu>
        <VerticalMenuList>
          <VerticalMenuItem>
            <VerticalMenuTrigger>О магазине</VerticalMenuTrigger>
            <VerticalMenuList>
              <VerticalMenuItem>
                <VerticalMenuLink href="/info/about">О нас</VerticalMenuLink>
              </VerticalMenuItem>
              <VerticalMenuItem>
                <VerticalMenuLink href="/info/discount">Скидочные карты</VerticalMenuLink>
              </VerticalMenuItem>
              {/* <VerticalMenuItem>
                <VerticalMenuLink href="#Программа лояльности">
                  Программа лояльности
                </VerticalMenuLink>
              </VerticalMenuItem> */}
              <VerticalMenuItem>
                <VerticalMenuLink href="/info/school">
                  Школа подводной охоты и дайвинга
                </VerticalMenuLink>
              </VerticalMenuItem>
            </VerticalMenuList>
          </VerticalMenuItem>
          <VerticalMenuItem>
            <VerticalMenuLink href="/info/delivery-and-payment">Доставка и оплата</VerticalMenuLink>
          </VerticalMenuItem>
          <VerticalMenuItem>
            <VerticalMenuLink href="/info/wholesalers">Оптовикам</VerticalMenuLink>
          </VerticalMenuItem>
          <VerticalMenuItem>
            <VerticalMenuLink href="/blog">Блог</VerticalMenuLink>
          </VerticalMenuItem>
          <VerticalMenuItem>
            <VerticalMenuLink href="/info/gift-certificates">
              Подарочные сертификаты
            </VerticalMenuLink>
          </VerticalMenuItem>
          <VerticalMenuItem>
            <VerticalMenuLink href="/contacts">Контакты</VerticalMenuLink>
          </VerticalMenuItem>
          <VerticalMenuItem>
            <VerticalMenuLink href="/info/legal">Юридическая информация</VerticalMenuLink>
          </VerticalMenuItem>
        </VerticalMenuList>
      </VerticalMenu>
    </div>
  )
}
