import { createStore } from 'zustand/vanilla'
import { persist, StateStorage, createJSONStorage } from 'zustand/middleware'
import { ProductsFilter, type ProductEntity } from '@/types'
import { apiGet } from '@/lib/api'

export type ProductsState = {
  page: number
  limit: number
  filter: string
  sort: string
  dir: string
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

export const defaultProductsStore = {
  page: 1,
  limit: 24,
  filter: '{}',
  sort: 'id',
  dir: 'ASC'
}

export const createProductsStore = (props: { params?: Record<string, any> } = {}) => {
  return createStore<ProductsStore>()((set, get) => ({
    page: defaultProductsStore.page,
    limit: defaultProductsStore.limit,
    filter: defaultProductsStore.filter,
    sort: defaultProductsStore.sort,
    dir: defaultProductsStore.dir,
    loading: false,
    listElement: null,
    data: {
      total: 0,
      rows: [],
      filters: []
    },

    async onChangePagination(page, limit) {
      set({ page, limit })
      await get().load()
      get().scrollIntoView()
    },

    async onChangeFilter(filter) {
      set({ filter, page: 1 })
      await get().load()
    },

    async onChangeSort(sort, dir) {
      set({ sort, dir })
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
      const query: Record<string, any> = {
        page: store.page,
        limit: store.limit,
        filter: store.filter,
        sort: store.sort,
        dir: store.dir
      }
      const data = await apiGet<ProductsState['data']>('products', query)
      set({ data, loading: false })
    }
  }))
}
