import { createStore } from 'zustand/vanilla'
import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api'
import type { CartEntity, ProductEntity, WishlistEntity, WishlistType } from '@/types'

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
      comparison: null,
      viewed: null
    },
    products: {
      favourites: [],
      comparison: [],
      viewed: []
    },

    async createWishlist(type) {
      let wishlistId = null
      try {
        const data = await apiPut<WishlistEntity>(`wishlist/${type}`)
        wishlistId = data.id
        get().setWishlistId(wishlistId, type)
      } catch (e) {}
      return wishlistId
    },

    // Загрузка списка товаров. ID может не быть, если список не был инициализирован.
    // Это нужно чтобы не создавать пустые списки для каждого посетителя.
    async loadWishlist(type) {
      const wishlistId = get().ids[type]

      let products: ProductEntity[] = []

      if (wishlistId) {
        try {
          products = await apiGet<ProductEntity[]>(`wishlist/${type}/${wishlistId}/products`)
        } catch (e) {}
      }

      get().setWishlistProducts(products, type)
    },

    // Добавление товара в список
    async addToWishlist(productId, type) {
      let wishlistId = get().ids[type]
      // список будет создан, если его нет
      if (!wishlistId) wishlistId = await get().createWishlist(type)
      if (!wishlistId) return
      try {
        const products = await apiPut<ProductEntity[]>(`wishlist/${type}/${wishlistId}/products`, {
          productId
        })
        get().setWishlistProducts(products, type)
      } catch (e) {}
    },

    // Удаление товара из списка
    async removeFromWishlist(productId, type) {
      const wishlistId = get().ids[type]

      if (!wishlistId) return

      try {
        const products = await apiDelete<ProductEntity[]>(
          `wishlist/${type}/${wishlistId}/products`,
          { productId }
        )
        get().setWishlistProducts(products, type)
      } catch (e) {}
    },

    // Удаление списка
    async deleteWishlist(type) {
      const wishlistId = get().ids[type]

      if (!wishlistId) return

      try {
        await apiDelete<ProductEntity[]>(`wishlist/${type}/${wishlistId}`)
        // Удаление товаров и id списка
        get().setWishlistProducts([], type)
        get().setWishlistId(null, type)
      } catch (e) {}
    },

    // Обновляем товары списка и сатистику
    setWishlistProducts(products: ProductEntity[], type) {
      set((prev) => ({ products: { ...prev.products, [type]: products } }))
    },

    // Сохранение id списка в стор и localStorage
    setWishlistId(wishlistId, type) {
      set((prev) => ({ ids: { ...prev.ids, [type]: wishlistId } }))

      if (wishlistId) {
        localStorage.setItem(`wishlist:${type}`, wishlistId)
      } else {
        localStorage.removeItem(`wishlist:${type}`)
      }
    }
  }))
