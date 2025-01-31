'use client'

import { shallowEqual } from '@/lib/utils'
import {
  type ProductsStore,
  createProductsStore,
  defaultProductsStore
} from '@/stores/products-store'
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'
import { type ReactNode, createContext, useContext, useEffect, useRef, useState } from 'react'
import { useStore } from 'zustand'

export type ProductStoreApi = ReturnType<typeof createProductsStore>

export const ProductStoreContext = createContext<ProductStoreApi | undefined>(undefined)

export interface ProductsStoreProviderProps {
  children: ReactNode
  categoryId?: number
  favorite?: boolean
}

export const ProductsStoreProvider = ({
  children,
  categoryId,
  favorite
}: ProductsStoreProviderProps) => {
  const [initialized, setInitialized] = useState(false)

  const storeRef = useRef<ProductStoreApi>(null)
  if (!storeRef.current) {
    storeRef.current = createProductsStore({ categoryId, favorite })
  }

  const searchParamsRef = useRef(defaultProductsStore)
  const [searchParams, setSearchParams] = useQueryStates(
    {
      page: parseAsInteger.withDefault(defaultProductsStore.page),
      limit: parseAsInteger.withDefault(defaultProductsStore.limit),
      filter: parseAsString.withDefault(defaultProductsStore.filter),
      sort: parseAsString.withDefault(defaultProductsStore.sort),
      dir: parseAsString.withDefault(defaultProductsStore.dir)
    },
    {
      history: 'push',
      clearOnDefault: true
    }
  )

  const stateToSearchParams = (state: ProductsStore) => ({
    page: state.page,
    limit: state.limit,
    filter: state.filter,
    sort: state.sort,
    dir: state.dir
  })

  // при изменении параметров в адресной строке обновить состояние и загрузить товары
  useEffect(() => {
    if (!initialized || !storeRef.current) return

    const store = storeRef.current
    const state = store.getState()

    if (!shallowEqual(searchParams, stateToSearchParams(state))) {
      searchParamsRef.current = searchParams
      store.setState(searchParams)
      store.getState().load(true)
    }
  }, [searchParams])

  // при первой инициализации загрузить товары с параметрами из адресной строки и подписаться на изменения стора
  useEffect(() => {
    if (!!initialized || !storeRef.current) return

    const store = storeRef.current

    // по умолчанию взять параметры из адресной строки и загрузить товары
    searchParamsRef.current = searchParams
    store.setState(searchParams)
    store.getState().load()

    // при изменении параметров в сторе изменить их также адресной строке
    store.subscribe((state) => {
      const stateParams = stateToSearchParams(state)
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
