import { createStore } from 'zustand/vanilla'
import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api'
import type { CartEntity, ProductEntity, WishlistEntity } from '@/types'

export enum WishlistType {
  FAVOURITES = 'favourites',
  COMPARISON = 'comparison'
}

export type WichlistState = {
  ids: { [key in WishlistType]: string | null }
  products: { [key in WishlistType]: ProductEntity[] }
}

export type WichlistActions = {
  loadWishlist(type: WishlistType): Promise<void>
  addToWishlist(id: number, type: WishlistType): Promise<void>
  removeFromWishlist(id: number, type: WishlistType): Promise<void>
  deleteWishlist(type: WishlistType): Promise<void>
  setWishlistProducts(products: ProductEntity[], type: WishlistType): void
  setWishlistId(id: string | null, type: WishlistType): void
  createWishlist(type: WishlistType): Promise<string | null>
}

export const createWichlistStore = () =>
  createStore<WichlistState & WichlistActions>()((set, get) => ({
    ids: {
      favourites: null,
      comparison: null
    },
    products: {
      favourites: [],
      comparison: []
    },

    async createWishlist(type) {
      let id = null
      try {
        const data = await apiPut<WishlistEntity>(`wishlist/${type}`)
        id = data.id
        get().setWishlistId(id, type)
      } catch (e) {}
      return id
    },

    // Загрузка списка товаров. ID может не быть, если список не был инициализирован.
    // Это нужно чтобы не создавать пустые списки для каждого посетителя.
    async loadWishlist(type) {
      const id = get().ids[type]

      let products: ProductEntity[] = []

      if (id) {
        try {
          products = await apiGet<ProductEntity[]>(`wishlist/${type}/${id}/products`)
        } catch (e) {}
      }

      get().setWishlistProducts(products, type)
    },

    // Добавление товара в корзину
    async addToWishlist(item) {
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
    async removeFromWishlist(product) {
      const cartId = get().cartId

      if (!cartId) return

      try {
        const cartProducts = await apiDelete<CartProductEntity[]>(
          `cart/${cartId}/products/${product.id}`
        )
        get().setCartProducts(cartProducts)
      } catch (e) {}
    },

    // Удаление корзины
    async deleteWishlist() {
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
    setWishlistProducts(cartProducts: CartProductEntity[]) {
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

    // Сохранение id списка в стор и localStorage
    setWishlistId(id, type) {
      set((prev) => ({ ids: { ...prev.ids, [type]: id } }))

      if (id) {
        localStorage.setItem(`${type}:${id}`, id)
      } else {
        localStorage.removeItem(`${type}:${id}`)
      }
    }
  }))
