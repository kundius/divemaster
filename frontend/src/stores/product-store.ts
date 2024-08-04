import computed from 'zustand-computed'
import { createStore } from 'zustand/vanilla'

import { formatPrice, pluck } from '@/lib/utils'
import {
  OfferEntity,
  OptionType,
  type OptionEntity,
  type OptionValueEntity,
  type ProductEntity
} from '@/types'

export type ProductState = {
  product: ProductEntity
  selectedOptionValues: Record<string, OptionValueEntity>
  selectableOptions: OptionEntity[]
  sortedOffers: OfferEntity[]
  selectedOffer: OfferEntity | undefined
}

export type ProductActions = {
  selectOptionValue(option: OptionEntity, value: OptionValueEntity): void
}

export type ComputedStore = {
  rawPrice: number | undefined
  displayPrice: string
  rawOldPrice: number | undefined
  displayOldPrice: string | undefined
}

export type ProductStore = ProductState & ProductActions

const computeState = (state: ProductStore): ComputedStore => {
  let rawPrice: number | undefined = undefined
  let displayPrice: string = ''
  let rawOldPrice: number | undefined = undefined
  let displayOldPrice: string | undefined = undefined
  let isFrom: boolean = false

  if (state.selectedOffer) {
    rawPrice = state.selectedOffer.price
    displayPrice = formatPrice(rawPrice)
  } else {
    if (!state.product.offers || state.product.offers.length === 0) {
      displayPrice = 'Цена по запросу'
    } else {
      const baseOffer = state.product.offers.find(
        (o) => o.optionValues && o.optionValues.length === 0
      )
      if (baseOffer && state.product.offers.length === 1) {
        rawPrice = baseOffer.price
        displayPrice = formatPrice(rawPrice)
      } else {
        rawPrice = Math.min(...state.product.offers.map((o) => o.price))
        displayPrice = `от ${formatPrice(rawPrice)}`
        isFrom = true
      }
    }
  }

  if (state.product.priceDecrease && !!rawPrice) {
    rawOldPrice = rawPrice * (state.product.priceDecrease / 100) + rawPrice
    if (isFrom) {
      displayOldPrice = `от ${formatPrice(rawOldPrice)}`
    } else {
      displayOldPrice = formatPrice(rawOldPrice)
    }
  }

  return {
    rawPrice,
    displayPrice,
    rawOldPrice,
    displayOldPrice
  }
}

const SELECTABLE_OPTION_TYPES = [OptionType.COMBOCOLORS, OptionType.COMBOOPTIONS]

export const createProductStore = (product: ProductEntity) => {
  const getSelectableOptions = () => {
    if (!product.options) return []
    return product.options.filter(({ type }) => SELECTABLE_OPTION_TYPES.includes(type))
  }

  const getSortedOffers = () => {
    if (!product.offers) return []
    return product.offers
      .sort((a, b) => {
        if (!a.optionValues || !b.optionValues) return 0
        if (a.optionValues.length < b.optionValues.length) return -1
        if (a.optionValues.length > b.optionValues.length) return 1
        return 0
      })
      .reverse()
  }

  return createStore<ProductStore>()(
    computed(
      (set, get) => ({
        product,
        selectedOptionValues: {},
        selectableOptions: getSelectableOptions(),
        sortedOffers: getSortedOffers(),
        selectedOffer: undefined,

        selectOptionValue(option, value) {
          const selectedOptionValues = { ...get().selectedOptionValues, [option.key]: value }
          const selectedValues = Object.values(selectedOptionValues)
          const selectedOffer = get().sortedOffers.find((offer) => {
            if (!offer.optionValues) return false
            if (offer.optionValues.length === 0 && selectedValues.length === 0) return true
            return pluck(offer.optionValues, 'id').every((id) => {
              return pluck(selectedValues, 'id').includes(id)
            })
          })

          set({ selectedOffer, selectedOptionValues })
        }
      }),
      computeState
    )
  )
}
