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
  basicOffer: OfferEntity | undefined
  additionalOffers: OfferEntity[]
  selectedOffer: OfferEntity | undefined

  allOptionsSelected: boolean
  defaultPrice: string
  defaultOldPrice?: string
  selectedPrice: string
  selectedOldPrice?: string
}

export type ProductActions = {
  selectOptionValue(option: OptionEntity, value: OptionValueEntity): void
}

export type ProductStore = ProductState & ProductActions

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

    option.values = (product.optionValues || []).filter((ov) => ov.optionId === option.id)
    if (!option.values || option.values.length === 0) return false

    // если значение только одно и оно не принадлежит торг. предл., то предлагать его не нужно
    if (option.values.length === 1) {
      return !!sortedOffers.find(
        (offer) => !!offer.optionValues?.find((value) => option?.values?.[0].id === value.id)
      )
    }
    return true
  })

  function applyDecrease(value: number, decrease: number) {
    return value * (decrease / 100) + value
  }

  function getPrice(selectedOffer?: OfferEntity) {
    if (selectedOffer) {
      return formatPrice(selectedOffer.price)
    }

    if (!product.offers || product.offers.length === 0) {
      return 'Цена по запросу'
    }

    const baseOffer = product.offers.find((o) => o.optionValues && o.optionValues.length === 0)
    if (baseOffer && product.offers.length === 1) {
      return formatPrice(baseOffer.price)
    }

    const minPrice = Math.min(...product.offers.map((o) => o.price))
    return `от ${formatPrice(minPrice)}`
  }

  function getOldPrice(selectedOffer?: OfferEntity) {
    if (!product.priceDecrease) return undefined

    if (selectedOffer) {
      return formatPrice(applyDecrease(selectedOffer.price, product.priceDecrease))
    }

    if (!product.offers || product.offers.length === 0) {
      return undefined
    }

    const baseOffer = product.offers.find((o) => o.optionValues && o.optionValues.length === 0)
    if (baseOffer && product.offers.length === 1) {
      return formatPrice(applyDecrease(baseOffer.price, product.priceDecrease))
    }

    const minPrice = Math.min(...product.offers.map((o) => o.price))
    return `от ${formatPrice(applyDecrease(minPrice, product.priceDecrease))}`
  }

  function isAllOptionsSelected(selectedOptionValues: Record<string, OptionValueEntity>) {
    const selectableKeys = selectableOptions.map((item) => item.key)
    if (selectableKeys.every((key) => !!selectedOptionValues[key])) {
      return true
    }
    return false
  }

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

  return createStore<ProductStore>()((set, get) => ({
    // статичные данные, не меняются
    product,
    selectableOptions,
    sortedOffers,
    basicOffer,
    additionalOffers,

    // будут меняться
    selectedOptionValues,
    selectedOffer,

    // меняться не будут, нужно высчитать по умолчанию
    defaultPrice: getPrice(),
    defaultOldPrice: getOldPrice(),

    // будут меняться, нужно высчитать по умолчанию
    selectedPrice: getPrice(selectedOffer),
    selectedOldPrice: getOldPrice(selectedOffer),
    allOptionsSelected: isAllOptionsSelected(selectedOptionValues),

    selectOptionValue(option, value) {
      const selectedOptionValues = { ...get().selectedOptionValues, [option.key]: value }
      const selectedValues = Object.values(selectedOptionValues)

      // Если дополнительных офферов нет, то выбираем базовый независимо от выбранных опций
      // Если есть дополнительные офферы, то выбираем среди них соответствующий опциям
      let selectedOffer: ProductState['selectedOffer'] = undefined
      if (additionalOffers.length === 0) {
        selectedOffer = basicOffer
      } else {
        selectedOffer = additionalOffers.find((offer) => {
          if (!offer.optionValues) return false
          return pluck(offer.optionValues, 'id').every((id) =>
            pluck(selectedValues, 'id').includes(id)
          )
        })
      }

      set({
        selectedOffer,
        selectedOptionValues,

        selectedPrice: getPrice(selectedOffer),
        selectedOldPrice: getOldPrice(selectedOffer),
        allOptionsSelected: isAllOptionsSelected(selectedOptionValues)
      })
    }
  }))
}
