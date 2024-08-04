'use client'

import { type ReactNode, createContext, useContext, useRef } from 'react'
import { useStore } from 'zustand'

// import { apiPost } from '@/lib/api'
// import { withClientAuth } from '@/lib/api/with-client-auth'
import { ComputedStore, type ProductStore, createProductStore } from '@/stores/product-store'
// import { useAuthStore } from './auth-store-provider'
import { ProductEntity } from '@/types'

export type ProductStoreApi = ReturnType<typeof createProductStore>

export const ProductStoreContext = createContext<ProductStoreApi | undefined>(undefined)

export interface ProductStoreProviderProps {
  children: ReactNode
  product: ProductEntity
}

export const ProductStoreProvider = ({ children, product }: ProductStoreProviderProps) => {
  const storeRef = useRef<ProductStoreApi>()
  if (!storeRef.current) {
    storeRef.current = createProductStore(product)
  }

  return (
    <ProductStoreContext.Provider value={storeRef.current}>{children}</ProductStoreContext.Provider>
  )
}

export const useProductStore = <T,>(selector: (store: ProductStore & ComputedStore) => T): T => {
  const context = useContext(ProductStoreContext)

  if (!context) {
    throw new Error(`useProductStore must be used within ProductStoreProvider`)
  }

  return useStore(context, selector)
}
