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
                <VerticalMenuLink href="#О нас">О нас</VerticalMenuLink>
              </VerticalMenuItem>
              <VerticalMenuItem>
                <VerticalMenuLink href="#Скидочные карты">Скидочные карты</VerticalMenuLink>
              </VerticalMenuItem>
              <VerticalMenuItem>
                <VerticalMenuLink href="#Программа лояльности">
                  Программа лояльности
                </VerticalMenuLink>
              </VerticalMenuItem>
              <VerticalMenuItem>
                <VerticalMenuLink href="#Школа подводной охоты и дайвинга">
                  Школа подводной охоты и дайвинга
                </VerticalMenuLink>
              </VerticalMenuItem>
            </VerticalMenuList>
          </VerticalMenuItem>
          <VerticalMenuItem>
            <VerticalMenuLink href="#Доставка и оплата">Доставка и оплата</VerticalMenuLink>
          </VerticalMenuItem>
          <VerticalMenuItem>
            <VerticalMenuLink href="#Оптовикам">Оптовикам</VerticalMenuLink>
          </VerticalMenuItem>
          <VerticalMenuItem>
            <VerticalMenuLink href="#Блог">Блог</VerticalMenuLink>
          </VerticalMenuItem>
          <VerticalMenuItem>
            <VerticalMenuLink href="#Подарочные сертификаты">
              Подарочные сертификаты
            </VerticalMenuLink>
          </VerticalMenuItem>
          <VerticalMenuItem>
            <VerticalMenuLink href="#Контакты">Контакты</VerticalMenuLink>
          </VerticalMenuItem>
          <VerticalMenuItem>
            <VerticalMenuLink href="#Юридическая информация">
              Юридическая информация
            </VerticalMenuLink>
          </VerticalMenuItem>
        </VerticalMenuList>
      </VerticalMenu>
    </div>
  )
}
