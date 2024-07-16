import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api'
import { withClientAuth } from '@/lib/api/with-client-auth'
import { CartEntity, CartProductEntity } from '@/types'
import { createStore } from 'zustand/vanilla'

export type CartState = {
  cartId: string | null
  cartProducts: CartProductEntity[]
}

export type CartActions = {
  getCartId: (create?: boolean) => Promise<CartState['cartId']>
  loadCart: () => Promise<void>
  addToCart: (item: { id: number; amount?: number; options?: string | null }) => Promise<void>
  removeFromCart: (product: CartProductEntity) => Promise<void>
  changeAmount: (product: CartProductEntity) => Promise<void>
  deleteCart: () => Promise<void>
  saveCartId: (cartId: string | null) => void
}

export type CartStore = CartState & CartActions

export const defaultInitState: CartState = { cartId: null, cartProducts: [] }

export const initCartStore = (): CartState => {
  return defaultInitState
}

export const createCartStore = (initState: CartState = defaultInitState) => {
  return createStore<CartStore>()((set, get) => ({
    ...initState,

    // Получение id корзины
    async getCartId(create = true) {
      // Если id нет в state
      let cartId = get().cartId
      if (!cartId) {
        // Пробуем получить старый id из localStorage
        cartId = localStorage.getItem('cartId')
        if (cartId) {
          set({ cartId })
        } else if (create) {
          // Если не указано иное - соаздём новую корзину
          try {
            const data = await apiPut<CartEntity>('cart', {}, withClientAuth())
            cartId = data.uuid
            set({ cartId })
            get().saveCartId(cartId)
          } catch (e) {}
        }
      }
      return cartId
    },

    // Загрузка товаров корзины
    async loadCart() {
      // Здесь и далее id корзины получается через общий action
      // В этом случае отключено автосоздание корзины (параметр false)
      const cartId = await get().getCartId(false)
      // запрос на сервер делается только при наличии сохранённого id
      if (cartId) {
        try {
          const cartProducts = await apiGet<CartProductEntity[]>(
            `cart/${cartId}/products`,
            {},
            withClientAuth()
          )
          set({ cartProducts })
        } catch (e) {}
      }
    },

    // Добавление товара в корзину
    async addToCart(item) {
      // Здесь уже корзина будет создана, если её нет
      const cartId = await get().getCartId()
      try {
        const params = { id: item.id, amount: item.amount || 1, options: item.options || null }
        const cartProducts = await apiPut<CartProductEntity[]>(
          `cart/${cartId}/products`,
          params,
          withClientAuth()
        )
        set({ cartProducts })
      } catch (e) {}
    },

    // Удаление товара из корзины
    async removeFromCart(product) {
      const cartId = await get().getCartId()
      try {
        const cartProducts = await apiDelete<CartProductEntity[]>(
          `cart/${cartId}/products/${product.productKey}`,
          {},
          withClientAuth()
        )
        set({ cartProducts })
      } catch (e) {}
    },

    // Изменение количества товара
    async changeAmount(product) {
      const cartId = await get().getCartId()
      // Если количество <= 0, то удаляем товар
      if (product.amount <= 0) {
        return get().removeFromCart(product)
      }
      try {
        const params = { amount: product.amount }
        const cartProducts = await apiPost<CartProductEntity[]>(
          `cart/${cartId}/products/${product.productKey}`,
          params,
          withClientAuth()
        )
        set({ cartProducts })
      } catch (e) {}
    },

    // Удаление корзины
    async deleteCart() {
      const cartId = await get().getCartId(false)
      if (!cartId) {
        return
      }
      try {
        await apiDelete<CartProductEntity[]>(`cart/${cartId}`, {}, withClientAuth())
        // Удаление товаров и id корзины
        set({ cartProducts: [], cartId: null })
        get().saveCartId(null)
      } catch (e) {}
    },

    // Сохранение id корзины в localStorage
    saveCartId(cartId) {
      if (cartId) {
        localStorage.setItem('cartId', cartId)
      } else {
        localStorage.removeItem('cartId')
      }
    }
  }))
}
