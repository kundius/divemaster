import computed from 'zustand-computed'
import { createStore } from 'zustand/vanilla'
import { persist, StateStorage, createJSONStorage } from 'zustand/middleware'

import { formatPrice, getEntityId, pluck } from '@/lib/utils'
import {
  OfferEntity,
  OptionType,
  ProductsFilter,
  type OptionEntity,
  type OptionValueEntity,
  type ProductEntity
} from '@/types'
import { apiGet } from '@/lib/api'

export type ProductsState = {
  categoryId: number
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
  load(): Promise<void>
}

export type ProductsComputed = {}

export type ProductsStore = ProductsState & ProductsActions

const computeState = (state: ProductsStore): ProductsComputed => {
  return {}
}

export const defaultProductsStore = {
  page: 1,
  limit: 24,
  filter: '{}',
  sort: 'id',
  dir: 'ASC'
}

export const createProductsStore = (categoryId: number) => {
  return createStore<ProductsStore>()(
    computed(
      (set, get) => ({
        categoryId,
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
          get().load()

          const listElement = get().listElement
          if (listElement) {
            listElement.scrollIntoView({
              behavior: 'smooth'
            })
          }
        },

        onChangeFilter(filter) {
          set({ filter, page: 1 })
          get().load()
        },

        onChangeSort(sort, dir) {
          set({ sort, dir })
          get().load()
        },

        setListElement(listElement) {
          set({ listElement })
        },

        async load() {
          set({ loading: true })
          const store = get()
          const data = await apiGet<ProductsState['data']>('products', {
            page: store.page,
            limit: store.limit,
            filter: store.filter,
            category: categoryId,
            withImages: true,
            withBrand: true,
            withOptions: true,
            withOffers: true,
            active: true,
            // favorite: isParent,
            sort: store.sort,
            dir: store.dir
          })
          set({ data, loading: false })
        }
      }),
      computeState
    )
  )
}
