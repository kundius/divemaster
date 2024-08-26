import computed from 'zustand-computed'
import { createStore } from 'zustand/vanilla'

import { formatPrice, getEntityId, pluck } from '@/lib/utils'
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
  basicOffer: OfferEntity | undefined
  additionalOffers: OfferEntity[]
  selectedOffer: OfferEntity | undefined
}

export type ProductActions = {
  selectOptionValue(option: OptionEntity, value: OptionValueEntity): void
}

export type ComputedStore = {
  allOptionsSelected: boolean
  defaultPrice: string
  defaultOldPrice?: string
  selectedPrice: string
  selectedOldPrice?: string
}

export type ProductStore = ProductState & ProductActions

const computeState = (state: ProductStore): ComputedStore => {
  function applyDecrease(value: number, decrease: number) {
    return value * (decrease / 100) + value
  }

  function getPrice(selected = true) {
    if (selected && state.selectedOffer) {
      return formatPrice(state.selectedOffer.price)
    }

    if (!state.product.offers || state.product.offers.length === 0) {
      return 'Цена по запросу'
    }

    const baseOffer = state.product.offers.find(
      (o) => o.optionValues && o.optionValues.length === 0
    )
    if (baseOffer && state.product.offers.length === 1) {
      return formatPrice(baseOffer.price)
    }

    const minPrice = Math.min(...state.product.offers.map((o) => o.price))
    return `от ${formatPrice(minPrice)}`
  }

  function getOldPrice(selected = true) {
    if (!state.product.priceDecrease) return undefined

    if (selected && state.selectedOffer) {
      return formatPrice(applyDecrease(state.selectedOffer.price, state.product.priceDecrease))
    }

    if (!state.product.offers || state.product.offers.length === 0) {
      return undefined
    }

    const baseOffer = state.product.offers.find(
      (o) => o.optionValues && o.optionValues.length === 0
    )
    if (baseOffer && state.product.offers.length === 1) {
      return formatPrice(applyDecrease(baseOffer.price, state.product.priceDecrease))
    }

    const minPrice = Math.min(...state.product.offers.map((o) => o.price))
    return `от ${formatPrice(applyDecrease(minPrice, state.product.priceDecrease))}`
  }

  function isAllOptionsSelected() {
    const selectableKeys = state.selectableOptions.map((item) => item.key)
    if (selectableKeys.every((key) => !!state.selectedOptionValues[key])) {
      return true
    }
    return false
  }

  return {
    defaultPrice: getPrice(false),
    defaultOldPrice: getOldPrice(false),
    selectedPrice: getPrice(),
    selectedOldPrice: getOldPrice(),
    allOptionsSelected: isAllOptionsSelected()
  }
}

const SELECTABLE_OPTION_TYPES = [OptionType.COMBOCOLORS, OptionType.COMBOOPTIONS]

export const createProductStore = (product: ProductEntity) => {
  const sortedOffers = (product.offers || [])
    .sort((a, b) => {
      if (!a.optionValues || !b.optionValues) return 0
      if (a.optionValues.length < b.optionValues.length) return -1
      if (a.optionValues.length > b.optionValues.length) return 1
      return 0
    })
    .reverse()

  const basicOffer = sortedOffers.find(
    (offer) => offer.optionValues && offer.optionValues.length === 0
  )

  const additionalOffers = sortedOffers.filter(
    (offer) => offer.optionValues && offer.optionValues.length > 0
  )

  const selectableOptions = (product.options || []).filter((option) => {
    if (!SELECTABLE_OPTION_TYPES.includes(option.type)) return false

    option.values = (product.optionValues || []).filter(
      (ov) => getEntityId(ov.option) === option.id
    )
    if (!option.values || option.values.length === 0) return false

    // если значение только одно и оно не принадлежит торг. предл., то предлагать его не нужно
    if (option.values.length === 1) {
      return !!sortedOffers.find(
        (offer) => !!offer.optionValues?.find((value) => option?.values?.[0].id === value.id)
      )
    }
    return true
  })

  // Если дополнительных офферов нет, то используем базовый по умолчанию
  const selectedOffer = additionalOffers.length === 0 ? basicOffer : undefined

  const selectedOptionValues: ProductState['selectedOptionValues'] = {}
  // Одиночные характеристики можно бы выбрать по умолчанию,
  // но тогда нужно и оффер по умолчанию выбирать с учетом этих характеристик
  // const selectedOptionValues: ProductState['selectedOptionValues'] = selectableOptions.reduce(
  //   (acc, item) => {
  //     if (item.values && item.values.length === 1) {
  //       return { ...acc, [item.key]: item.values[0] }
  //     }
  //     return acc
  //   },
  //   {}
  // )

  return createStore<ProductStore>()(
    computed(
      (set, get) => ({
        product,
        selectableOptions,
        sortedOffers,
        basicOffer,
        additionalOffers,
        selectedOptionValues,
        selectedOffer,

        selectOptionValue(option, value) {
          const state = get()
          const selectedOptionValues = { ...state.selectedOptionValues, [option.key]: value }
          const selectedValues = Object.values(selectedOptionValues)

          // Если дополнительных офферов нет, то выбираем базовый независимо от выбранных опций
          // Если есть дополнительные офферы, то выбираем среди них соответствующий опциям
          let selectedOffer: ProductState['selectedOffer'] = undefined
          if (state.additionalOffers.length === 0) {
            selectedOffer = state.basicOffer
          } else {
            selectedOffer = state.additionalOffers.find((offer) => {
              if (!offer.optionValues) return false
              return pluck(offer.optionValues, 'id').every((id) =>
                pluck(selectedValues, 'id').includes(id)
              )
            })
          }

          set({ selectedOffer, selectedOptionValues })
        }
      }),
      computeState
    )
  )
}
