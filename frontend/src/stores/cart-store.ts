import { createStore } from 'zustand/vanilla'

import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api'
import { withClientAuth } from '@/lib/api/with-client-auth'
import type { CartEntity, CartProductEntity } from '@/types'

export type CartState = {
  cartId: string | null
  cartProducts: CartProductEntity[]
}

export type CartActions = {
  loadCart(): Promise<void>
  addToCart(item: { id: number; amount?: number; options?: string | null }): Promise<void>
  removeFromCart(product: CartProductEntity): Promise<void>
  changeAmount(product: CartProductEntity): Promise<void>
  deleteCart(): Promise<void>
  saveCartId(cartId: string | null): void
  createCart(): Promise<string | null>
}

export type CartStore = CartState & CartActions

export const defaultInitState: CartState = { cartId: null, cartProducts: [] }

export const createCartStore = (initState: CartState = defaultInitState) => {
  return createStore<CartStore>()((set, get) => ({
    ...initState,

    async createCart() {
      let cartId = null
      try {
        const data = await apiPut<CartEntity>('cart', {}, withClientAuth())
        cartId = data.uuid
        set({ cartId })
        get().saveCartId(cartId)
      } catch (e) {}
      return cartId
    },

    // Загрузка товаров корзины
    async loadCart() {
      const cartId = get().cartId

      let cartProducts: CartProductEntity[] = []

      if (cartId) {
        try {
          cartProducts = await apiGet<CartProductEntity[]>(
            `cart/${cartId}/products`,
            {},
            withClientAuth()
          )
          set({ cartProducts })
        } catch (e) {}
      }

      set({ cartProducts })
    },

    // Добавление товара в корзину
    async addToCart(item) {
      let cartId = get().cartId
      // корзина будет создана, если её нет
      if (!cartId) cartId = await get().createCart()
      if (!cartId) return
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
      const cartId = get().cartId

      if (!cartId) return

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
      const cartId = get().cartId

      if (!cartId) return

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
      const cartId = get().cartId

      if (!cartId) return

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
