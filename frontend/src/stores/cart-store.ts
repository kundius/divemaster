import { createStore } from 'zustand/vanilla'
import computed from 'zustand-computed'

import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api'
import { withClientAuth } from '@/lib/api/with-client-auth'
import type { CartEntity, CartProductEntity } from '@/types'

export type CartState = {
  cartId: string | null
  cartProducts: CartProductEntity[]
}

export type CartActions = {
  loadCart(): Promise<void>
  addToCart(item: { id: number; quantity?: number; optionValues?: number[] }): Promise<void>
  removeFromCart(product: CartProductEntity): Promise<void>
  changeQuantity(product: CartProductEntity, quantity: number): Promise<void>
  deleteCart(): Promise<void>
  saveCartId(cartId: string | null): void
  createCart(): Promise<string | null>
}

export type CartComputed = {
  total: {
    count: number
    price: number
    discount: number
    oldPrice: number
  }
}

const computeState = (state: CartState & CartActions): CartComputed => {
  let count: number = 0
  let price: number = 0
  let discount: number = 0
  let oldPrice: number = 0

  if (state.cartProducts.length > 0) {
    count = state.cartProducts.reduce((acc, n) => {
      return acc + n.quantity
    }, 0)
    price = state.cartProducts.reduce((acc, n) => {
      return acc + (n.price || 0) * n.quantity
    }, 0)
    discount = state.cartProducts.reduce((acc, item) => {
      return acc + ((item.oldPrice || item.price || 0) - (item.price || 0)) * item.quantity
    }, 0)
    oldPrice = state.cartProducts.reduce((acc, item) => {
      return acc + (item.oldPrice || item.price || 0) * item.quantity
    }, 0)
  }

  return { total: { count, price, discount, oldPrice } }
}

export const createCartStore = () =>
  createStore<CartState & CartActions>()(
    computed(
      (set, get) => ({
        cartId: null,
        cartProducts: [],

        async createCart() {
          let cartId = null
          try {
            const data = await apiPut<CartEntity>('cart', {}, withClientAuth())
            cartId = data.id
            set({ cartId })
            get().saveCartId(cartId)
          } catch (e) {}
          return cartId
        },

        // Загрузка товаров корзины
        async loadCart() {
          const cartId = get().cartId

          let cartProducts: CartState['cartProducts'] = []

          if (cartId) {
            try {
              cartProducts = await apiGet<CartProductEntity[]>(
                `cart/${cartId}/products`,
                {},
                withClientAuth()
              )
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
            const params = {
              id: item.id,
              quantity: item.quantity || 1,
              optionValues: item.optionValues || []
            }
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
              `cart/${cartId}/products/${product.id}`,
              {},
              withClientAuth()
            )
            set({ cartProducts })
          } catch (e) {}
        },

        // Изменение количества товара
        async changeQuantity(product, quantity) {
          const cartId = get().cartId

          if (!cartId) return

          // Если количество <= 0, то удаляем товар
          if (quantity <= 0) {
            return get().removeFromCart(product)
          }

          try {
            const params = { quantity }
            const cartProducts = await apiPost<CartProductEntity[]>(
              `cart/${cartId}/products/${product.id}`,
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
      }),
      computeState
    )
  )
