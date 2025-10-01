'use client'

import { shallowEqual } from '@/lib/utils'
import {
  ProductsStateBaseParams,
  type ProductsStore,
  createProductsStore,
  productsStoreDefaultSearchParams
} from '@/stores/products-store'
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'
import { type ReactNode, createContext, useContext, useEffect, useRef, useState } from 'react'
import { useStore } from 'zustand'

export type ProductStoreApi = ReturnType<typeof createProductsStore>

export const ProductStoreContext = createContext<ProductStoreApi | undefined>(undefined)

export interface ProductsStoreProviderProps {
  children: ReactNode
  initialBaseParams?: ProductsStateBaseParams
}

export const ProductsStoreProvider = ({
  children,
  initialBaseParams
}: ProductsStoreProviderProps) => {
  const [initialized, setInitialized] = useState(false)

  const storeRef = useRef<ProductStoreApi>(null)
  if (!storeRef.current) {
    storeRef.current = createProductsStore({ initialBaseParams })
  }

  const searchParamsRef = useRef(productsStoreDefaultSearchParams)
  const [searchParams, setSearchParams] = useQueryStates(
    {
      page: parseAsInteger.withDefault(productsStoreDefaultSearchParams.page),
      limit: parseAsInteger.withDefault(productsStoreDefaultSearchParams.limit),
      filter: parseAsString.withDefault(productsStoreDefaultSearchParams.filter),
      sort: parseAsString.withDefault(productsStoreDefaultSearchParams.sort),
      dir: parseAsString.withDefault(productsStoreDefaultSearchParams.dir),
      query: parseAsString.withDefault(productsStoreDefaultSearchParams.query)
    },
    {
      history: 'push',
      clearOnDefault: true
    }
  )

  // при изменении параметров в адресной строке обновить состояние и загрузить товары
  useEffect(() => {
    if (!initialized || !storeRef.current) return

    const store = storeRef.current
    const state = store.getState()

    if (!shallowEqual(searchParams, state.searchParams)) {
      searchParamsRef.current = searchParams
      store.setState((prev) => ({ searchParams: { ...prev.searchParams, ...searchParams } }))
      store.getState().load(true)
    }
  }, [searchParams])

  // при первой инициализации загрузить товары с параметрами из адресной строки и подписаться на изменения стора
  useEffect(() => {
    if (!!initialized || !storeRef.current) return

    const store = storeRef.current

    // по умолчанию взять параметры из адресной строки и загрузить товары
    searchParamsRef.current = searchParams
    store.setState((prev) => ({ searchParams: { ...prev.searchParams, ...searchParams } }))
    store.getState().load()

    // при изменении параметров в сторе изменить их также адресной строке
    store.subscribe((state) => {
      const stateParams = state.searchParams
      if (!shallowEqual(stateParams, searchParamsRef.current)) {
        searchParamsRef.current = stateParams
        setSearchParams(stateParams)
      }
    })

    setInitialized(true)
  }, [])

  return (
    <ProductStoreContext.Provider value={storeRef.current}>{children}</ProductStoreContext.Provider>
  )
}

export const useProductsStore = <T,>(selector: (store: ProductsStore) => T): T => {
  const context = useContext(ProductStoreContext)

  if (!context) {
    throw new Error(`useProductsStore must be used within ProductsStoreProvider`)
  }

  return useStore(context, selector)
}
