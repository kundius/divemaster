import {
  VerticalMenu,
  VerticalMenuItem,
  VerticalMenuLink,
  VerticalMenuList
} from '@/components/ui/vertical-menu'

export default function MobileNavigationPages() {
  return (
    <VerticalMenu>
      <VerticalMenuList>
        <VerticalMenuItem>
          <VerticalMenuLink>О магазине</VerticalMenuLink>
          <VerticalMenuList>
            <VerticalMenuItem>
              <VerticalMenuLink href="/info/about">О нас</VerticalMenuLink>
            </VerticalMenuItem>
            <VerticalMenuItem>
              <VerticalMenuLink href="/info/discount">Скидочные карты</VerticalMenuLink>
            </VerticalMenuItem>
            <VerticalMenuItem>
              <VerticalMenuLink href="/info/school">
                Школа подводной охоты и дайвинга
              </VerticalMenuLink>
            </VerticalMenuItem>
            <VerticalMenuItem>
              <VerticalMenuLink href="/info/legal">Юридическая информация</VerticalMenuLink>
            </VerticalMenuItem>
          </VerticalMenuList>
        </VerticalMenuItem>
        <VerticalMenuItem>
          <VerticalMenuLink href="/info/delivery">Доставка</VerticalMenuLink>
        </VerticalMenuItem>
        <VerticalMenuItem>
          <VerticalMenuLink href="/info/payment">Оплата</VerticalMenuLink>
        </VerticalMenuItem>
        <VerticalMenuItem>
          <VerticalMenuLink href="/info/guarantee">Гарантии</VerticalMenuLink>
        </VerticalMenuItem>
        <VerticalMenuItem>
          <VerticalMenuLink href="/info/buy">Как сделать заказ</VerticalMenuLink>
        </VerticalMenuItem>
        <VerticalMenuItem>
          <VerticalMenuLink href="/info/wholesalers">Оптовикам</VerticalMenuLink>
        </VerticalMenuItem>
        <VerticalMenuItem>
          <VerticalMenuLink href="/blog">Блог</VerticalMenuLink>
        </VerticalMenuItem>
        <VerticalMenuItem>
          <VerticalMenuLink href="/info/gift-certificates">Подарочные сертификаты</VerticalMenuLink>
        </VerticalMenuItem>
        <VerticalMenuItem>
          <VerticalMenuLink href="/contacts">Контакты</VerticalMenuLink>
        </VerticalMenuItem>
      </VerticalMenuList>
    </VerticalMenu>
  )
}
