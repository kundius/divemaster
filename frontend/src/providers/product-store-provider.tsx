'use client'

import { type ReactNode, createContext, useContext, useRef } from 'react'
import { useStore } from 'zustand'
import { type ProductStore, createProductStore } from '@/stores/product-store'
import { ProductEntity } from '@/types'

export type ProductStoreApi = ReturnType<typeof createProductStore>

export const ProductStoreContext = createContext<ProductStoreApi | undefined>(undefined)

export interface ProductStoreProviderProps {
  children: ReactNode
  product: ProductEntity
}

export const ProductStoreProvider = ({ children, product }: ProductStoreProviderProps) => {
  const storeRef = useRef<ProductStoreApi>(null)
  if (!storeRef.current) {
    storeRef.current = createProductStore(product)
  }

  return (
    <ProductStoreContext.Provider value={storeRef.current}>{children}</ProductStoreContext.Provider>
  )
}

export const useProductStore = <T,>(selector: (store: ProductStore) => T): T => {
  const context = useContext(ProductStoreContext)

  if (!context) {
    throw new Error(`useProductStore must be used within ProductStoreProvider`)
  }

  return useStore(context, selector)
}
