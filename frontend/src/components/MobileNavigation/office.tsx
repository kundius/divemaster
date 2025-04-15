import {
  VerticalMenu,
  VerticalMenuItem,
  VerticalMenuLink,
  VerticalMenuList
} from '@/components/ui/vertical-menu'
import { useAuthStore } from '@/providers/auth-store-provider'
import { useMobileNavigation } from '.'

export default function MobileNavigationOffice() {
  const logout = useAuthStore((state) => state.logout)
  const mobileNavigation = useMobileNavigation()
  return (
    <VerticalMenu>
      <VerticalMenuList>
        <VerticalMenuItem>
          <VerticalMenuLink href="/office">Мои данные</VerticalMenuLink>
        </VerticalMenuItem>
        <VerticalMenuItem>
          <VerticalMenuLink href="/office/orders">Мои заказы</VerticalMenuLink>
        </VerticalMenuItem>
        <VerticalMenuItem>
          <VerticalMenuLink href="/office/comparison">Сравнение товаров</VerticalMenuLink>
        </VerticalMenuItem>
        <VerticalMenuItem>
          <VerticalMenuLink href="/office/favourites">Избранное</VerticalMenuLink>
        </VerticalMenuItem>
        <VerticalMenuItem>
          <VerticalMenuLink onClick={() => logout().then(mobileNavigation.close)}>
            Выйти
          </VerticalMenuLink>
        </VerticalMenuItem>
      </VerticalMenuList>
    </VerticalMenu>
  )
}
