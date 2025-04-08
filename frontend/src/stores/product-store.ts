import { createStore } from 'zustand/vanilla'
import { formatPrice, pluck } from '@/lib/utils'
import {
  OfferEntity,
  PropertyType,
  type PropertyEntity,
  type ProductEntity,
  type ProductOptionEntity,
  type OfferOptionEntity
} from '@/types'
import { se } from 'date-fns/locale'

export type ProductState = {
  product: ProductEntity
  selectable: Array<{ property: PropertyEntity; options: string[] }>
  selected: Record<string, string>
  offer: OfferEntity | undefined
}

export type ProductActions = {
  selectOption(name: string, content: string): void
  reset(): void
  isAllOptionsSelected(selected: ProductState['selected']): boolean
  displayPrice(offer?: OfferEntity): string
  displayOldPrice(offer?: OfferEntity): string
}

export type ProductStore = ProductState & ProductActions

export const SELECTABLE_PROPERTY_TYPES = [PropertyType.COMBOCOLORS, PropertyType.COMBOOPTIONS]

function applyDecrease(value: number, decrease: number) {
  return value * (decrease / 100) + value
}

export const createProductStore = (product: ProductEntity) => {
  // Сформировать выбираемые параметры
  const selectable: ProductState['selectable'] = []
  for (const property of product.properties || []) {
    if (SELECTABLE_PROPERTY_TYPES.includes(property.type)) {
      const options = (product.options || [])
        .sort((a, b) => a.rank - b.rank)
        .filter((a) => a.name === property.key)
        .map((a) => a.content)
      if (options.length > 0) {
        selectable.push({ options, property })
      }
    }
  }

  // По умолчанию выбрать единственное торговое предложение без параметров
  let initialOffer: OfferEntity | undefined = undefined
  if (product.offers && product.offers.length === 1) {
    initialOffer = product.offers.find((offer) => (offer.options || []).length === 0)
  }

  const findOffer = (selected: ProductState['selected']) => {
    // Сортируем предложения по количеству параметров от большего к меньшему.
    const sorted = (product.offers || [])
      .sort((a, b) => {
        if (!a.options || !b.options) return 0
        if (a.options.length < b.options.length) return -1
        if (a.options.length > b.options.length) return 1
        return 0
      })
      .reverse()

    // Находим предложение, все параметры которого соответствуют выбранным.
    // Благодаря сортировке мы находим предложение с наибольшим сходством параметров.
    return sorted.find((offer) =>
      (offer.options || []).every(({ name, content }) => selected[name] === content)
    )
  }

  return createStore<ProductStore>()((set, get) => ({
    product,
    selectable,

    selected: {},
    offer: initialOffer,

    reset() {
      set({ selected: {}, offer: initialOffer })
    },

    selectOption(name, content) {
      // Установить значение
      const selected = { ...get().selected, [name]: content }

      // Найти торговое предложение по максимальному сходству параметров
      const offer = findOffer(selected)

      set({ selected, offer })
    },

    isAllOptionsSelected(selected) {
      return selectable.every(({ property }) => !!selected[property.key])
    },

    displayPrice(selectedOffer) {
      let price = ''
      if (selectedOffer) {
        price = formatPrice(selectedOffer.price)
      } else if (!product.offers || product.offers.length === 0) {
        price = 'Цена по запросу'
      } else {
        const minPrice = Math.min(...product.offers.map((o) => o.price))
        price = `от ${formatPrice(minPrice)}`
      }
      return price
    },

    displayOldPrice(selectedOffer) {
      let oldPrice = ''
      if (product.priceDecrease) {
        if (selectedOffer) {
          oldPrice = formatPrice(applyDecrease(selectedOffer.price, product.priceDecrease))
        } else if (!product.offers || product.offers.length === 0) {
          oldPrice = ''
        } else {
          const minPrice = Math.min(...product.offers.map((o) => o.price))

          oldPrice = `от ${formatPrice(applyDecrease(minPrice, product.priceDecrease))}`
        }
      }
      return oldPrice
    }
  }))
}
