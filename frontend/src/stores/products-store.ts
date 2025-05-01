import { createStore } from 'zustand/vanilla'
import { persist, StateStorage, createJSONStorage } from 'zustand/middleware'
import { ProductsFilter, type ProductEntity } from '@/types'
import { apiGet } from '@/lib/api'

export type ProductsStateSearchParams = {
  page: number
  limit: number
  filter: string
  sort: string
  dir: string
}

export type ProductsStateParams = {
  [key: string]: string | number
}

export type ProductsState = {
  searchParams: ProductsStateSearchParams
  params: ProductsStateParams
  loading: boolean
  listElement: HTMLElement | null
  data: {
    rows: ProductEntity[]
    filters: ProductsFilter[]
    total: number
  }
}

export type ProductsActions = {
  onChangePagination(page: number, limit: number): Promise<void>
  onChangeFilter(filter: string): Promise<void>
  onChangeSort(sort: string, dir: string): Promise<void>
  setListElement(listElement: HTMLElement | null): void
  scrollIntoView(): void
  load(scroll?: boolean): Promise<void>
}

export type ProductsStore = ProductsState & ProductsActions

export const productsStoreDefaultSearchParams: ProductsStateSearchParams = {
  page: 1,
  limit: 24,
  filter: '{}',
  sort: 'id',
  dir: 'ASC'
}

export interface CreateProductsStoreProps {
  params?: ProductsStateParams
}

export const createProductsStore = ({ params }: CreateProductsStoreProps) => {
  return createStore<ProductsStore>()((set, get) => ({
    searchParams: productsStoreDefaultSearchParams,
    params: params || {},
    loading: false,
    listElement: null,
    data: {
      total: 0,
      rows: [],
      filters: []
    },

    async onChangePagination(page, limit) {
      set((prev) => ({ searchParams: { ...prev.searchParams, page, limit } }))
      await get().load()
      get().scrollIntoView()
    },

    async onChangeFilter(filter) {
      set((prev) => ({ searchParams: { ...prev.searchParams, filter, page: 1 } }))
      await get().load()
    },

    async onChangeSort(sort, dir) {
      set((prev) => ({ searchParams: { ...prev.searchParams, sort, dir } }))
      await get().load()
    },

    setListElement(el) {
      set({ listElement: el })
    },

    scrollIntoView() {
      const listElement = get().listElement
      if (listElement) {
        listElement.scrollIntoView({
          behavior: 'smooth'
        })
      }
    },

    async load() {
      set({ loading: true })
      const store = get()
      const data = await apiGet<ProductsState['data']>('products', {
        ...store.searchParams,
        ...store.params
      })
      set({ data, loading: false })
    }
  }))
}
