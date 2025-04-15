import { createStore } from 'zustand/vanilla'
import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api'
import type { CartEntity, CartProductEntity } from '@/types'

export type CartState = {
  total: {
    count: number
    price: number
    discount: number
    oldPrice: number
  }
  cartId: string | null
  cartProducts: CartProductEntity[]
}

export type CartActions = {
  loadCart(): Promise<void>
  addToCart(item: {
    id: number
    quantity?: number
    options?: Record<string, string>
  }): Promise<void>
  removeFromCart(product: CartProductEntity): Promise<void>
  changeQuantity(product: CartProductEntity, quantity: number): Promise<void>
  deleteCart(): Promise<void>
  setCartProducts(cartProducts: CartProductEntity[]): void
  setCartId(cartId: string | null): void
  createCart(): Promise<string | null>
}

export const createCartStore = () =>
  createStore<CartState & CartActions>()((set, get) => ({
    cartId: null,
    cartProducts: [],
    total: {
      count: 0,
      price: 0,
      discount: 0,
      oldPrice: 0
    },

    async createCart() {
      let cartId = null
      try {
        const data = await apiPut<CartEntity>('cart')
        cartId = data.id
        get().setCartId(cartId)
      } catch (e) {}
      return cartId
    },

    // Загрузка товаров корзины
    async loadCart() {
      const cartId = get().cartId

      let cartProducts: CartState['cartProducts'] = []

      if (cartId) {
        try {
          cartProducts = await apiGet<CartProductEntity[]>(`cart/${cartId}/products`)
        } catch (e) {}
      }

      get().setCartProducts(cartProducts)
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
          options: item.options || {}
        }
        const cartProducts = await apiPut<CartProductEntity[]>(`cart/${cartId}/products`, params)
        get().setCartProducts(cartProducts)
      } catch (e) {}
    },

    // Удаление товара из корзины
    async removeFromCart(product) {
      const cartId = get().cartId

      if (!cartId) return

      try {
        const cartProducts = await apiDelete<CartProductEntity[]>(
          `cart/${cartId}/products/${product.id}`
        )
        get().setCartProducts(cartProducts)
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
          params
        )
        get().setCartProducts(cartProducts)
      } catch (e) {}
    },

    // Удаление корзины
    async deleteCart() {
      const cartId = get().cartId

      if (!cartId) return

      try {
        await apiDelete<CartProductEntity[]>(`cart/${cartId}`)
        // Удаление товаров и id корзины
        get().setCartProducts([])
        get().setCartId(null)
      } catch (e) {}
    },

    // Обновляем товары корзины и сатистику
    setCartProducts(cartProducts: CartProductEntity[]) {
      let count: number = 0
      let price: number = 0
      let discount: number = 0
      let oldPrice: number = 0

      if (cartProducts.length > 0) {
        count = cartProducts.reduce((acc, n) => {
          return acc + n.quantity
        }, 0)
        price = cartProducts.reduce((acc, n) => {
          return acc + (n.price || 0) * n.quantity
        }, 0)
        discount = cartProducts.reduce((acc, item) => {
          return acc + ((item.oldPrice || item.price || 0) - (item.price || 0)) * item.quantity
        }, 0)
        oldPrice = cartProducts.reduce((acc, item) => {
          return acc + (item.oldPrice || item.price || 0) * item.quantity
        }, 0)
      }

      set({ cartProducts, total: { count, price, discount, oldPrice } })
    },

    // Сохранение id корзины в localStorage
    setCartId(cartId) {
      set({ cartId })

      if (cartId) {
        localStorage.setItem('cartId', cartId)
      } else {
        localStorage.removeItem('cartId')
      }
    }
  }))
