'use client'

import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'
import {
  type ReactNode,
  Suspense,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import { useStore } from 'zustand'

import { shallowEqual } from '@/lib/utils'
import {
  ProductsComputed,
  type ProductsStore,
  createProductsStore,
  defaultProductsStore
} from '@/stores/products-store'

export type ProductStoreApi = ReturnType<typeof createProductsStore>

export const ProductStoreContext = createContext<ProductStoreApi | undefined>(undefined)

export interface ProductsStoreProviderProps {
  children: ReactNode
  categoryId: number
}

export const ProductsStoreProvider = ({ children, categoryId }: ProductsStoreProviderProps) => {
  const storeRef = useRef<ProductStoreApi>()
  if (!storeRef.current) {
    storeRef.current = createProductsStore(categoryId)
  }

  return (
    <ProductStoreContext.Provider value={storeRef.current}>
      {children}
      <Suspense>
        <SuspendedStore store={storeRef.current} />
      </Suspense>
    </ProductStoreContext.Provider>
  )
}

export const useProductsStore = <T,>(
  selector: (store: ProductsStore & ProductsComputed) => T
): T => {
  const context = useContext(ProductStoreContext)

  if (!context) {
    throw new Error(`useProductsStore must be used within ProductsStoreProvider`)
  }

  return useStore(context, selector)
}

interface SuspendedStoreProps {
  store: ProductStoreApi
}

function SuspendedStore({ store }: SuspendedStoreProps) {
  const [initial, setInitial] = useState(true)
  const storeParams = useStore(store, (state) => ({
    page: state.page,
    filter: state.filter,
    limit: state.limit
  }))
  const [searchParams, setSearchParams] = useQueryStates(
    {
      page: parseAsInteger.withDefault(defaultProductsStore.page),
      limit: parseAsInteger.withDefault(defaultProductsStore.limit),
      filter: parseAsString.withDefault(defaultProductsStore.filter)
    },
    {
      history: 'push',
      clearOnDefault: true
    }
  )

  // При изменении параметров в сторе, обноаляем адресную строку
  useEffect(() => {
    if (initial) return

    if (!shallowEqual(searchParams, storeParams)) {
      setSearchParams(storeParams)
    }
  }, Object.values(storeParams))

  // При изменении параметров в адресной строке, обноаляем состояние и загружаем товары
  useEffect(() => {
    if (initial) return

    if (!shallowEqual(searchParams, storeParams)) {
      store.setState(searchParams)
      store.getState().load()
    }
  }, [searchParams])

  // При первой инициализации загружаем товары с параметрами из адресной строки
  useEffect(() => {
    store.setState(searchParams)
    store.getState().load()
    setInitial(false)
  }, [])

  return null
}
