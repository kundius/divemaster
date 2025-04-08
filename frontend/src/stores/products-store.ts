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
  onChangePagination(page: number, limit: number): void
  onChangeFilter(filter: string): void
  onChangeSort(sort: string, dir: string): void
  setListElement(listElement: HTMLElement | null): void
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

export const createProductsStore = (prams?: { categoryId?: number; favorite?: boolean }) => {
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

    onChangePagination(page, limit) {
      set({ page, limit })
      get().load(true)
    },

    onChangeFilter(filter) {
      set({ filter, page: 1 })
      get().load()
    },

    onChangeSort(sort, dir) {
      set({ sort, dir })
      get().load()
    },

    setListElement(el) {
      set({ listElement: el })
    },

    async load(scroll = false) {
      set({ loading: true })
      const store = get()
      const params: Record<string, any> = {
        page: store.page,
        limit: store.limit,
        filter: store.filter,
        withImages: true,
        withBrand: true,
        withOptions: true,
        withOffers: true,
        active: true,
        sort: store.sort,
        dir: store.dir
      }
      if (prams?.categoryId) {
        params.category = prams.categoryId
      }
      if (prams?.favorite) {
        params.favorite = prams.favorite
      }
      const data = await apiGet<ProductsState['data']>('products', params)
      set({ data, loading: false })

      if (scroll) {
        const listElement = get().listElement
        if (listElement) {
          listElement.scrollIntoView({
            behavior: 'smooth'
          })
        }
      }
    }
  }))
}
