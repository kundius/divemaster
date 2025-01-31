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
  selectableOptions: OptionEntity[]
  selectedOptionValues: OptionValueEntity[]
  selectedOffer: OfferEntity | undefined
}

export type ProductActions = {
  selectOptionValue(value: OptionValueEntity): void
  reset(): void
  isAllOptionsSelected(selectedOptionValues: OptionValueEntity[]): boolean
  displayPrice(selectedOffer?: OfferEntity): string
  displayOldPrice(selectedOffer?: OfferEntity): string
}

export type ProductStore = ProductState & ProductActions

const SELECTABLE_OPTION_TYPES = [OptionType.COMBOCOLORS, OptionType.COMBOOPTIONS]

function applyDecrease(value: number, decrease: number) {
  return value * (decrease / 100) + value
}

export const createProductStore = (product: ProductEntity) => {
  // Оставить только те необходимые параметры
  const selectableOptions = (product.options || []).filter((option) => {
    // Пропустить невариативный параметр
    if (!SELECTABLE_OPTION_TYPES.includes(option.type)) return false

    // Найти значения параметра
    const optionValues = option.values || []

    // Пропустить параметр без значений
    if (optionValues.length === 0) return false

    // Пропустить параметр с единственным значением и без связи с торговым предложением
    if (optionValues.length === 1) {
      const foundOffer = (product.offers || []).find((offer) =>
        (offer.optionValues || []).some((offerOptionValue) =>
          optionValues.find((optionValue) => optionValue.id === offerOptionValue.id)
        )
      )
      if (!foundOffer) return false
    }

    return true
  })

  // По умолчанию выбрать единственное торговое предложение без параметров
  let initialOffer: OfferEntity | undefined = undefined
  if (product.offers && product.offers.length === 1) {
    initialOffer = product.offers.find((offer) => (offer.optionValues || []).length === 0)
  }

  const findOffer = (selectedOptionValues: OptionValueEntity[]) => {
    // Сортируем предложения по количеству параметров от большего к меньшему.
    const sorted = (product.offers || [])
      .sort((a, b) => {
        if (!a.optionValues || !b.optionValues) return 0
        if (a.optionValues.length < b.optionValues.length) return -1
        if (a.optionValues.length > b.optionValues.length) return 1
        return 0
      })
      .reverse()

    // Группируем идентификаторы выбранных значений
    const ids = Object.values(selectedOptionValues).map((optionValue) => optionValue.id)

    // Находим предложение, все параметры которого соответствуют выбранным.
    // Благодаря сортировке мы находим предложение с наибольшим сходством параметров.
    return sorted.find((offer) => (offer.optionValues || []).every(({ id }) => ids.includes(id)))
  }

  return createStore<ProductStore>()((set, get) => ({
    product,
    selectableOptions,

    selectedOptionValues: [],
    selectedOffer: initialOffer,

    reset() {
      set({ selectedOptionValues: [], selectedOffer: initialOffer })
    },

    selectOptionValue(value) {
      // Убрать дургое значение параметра и такое же
      const selectedOptionValues = get().selectedOptionValues.filter((selectedOptionValue) => {
        if (selectedOptionValue.optionId === value.optionId) return false
        if (selectedOptionValue.id === value.id) return false
        return true
      })

      // Добавить значение
      selectedOptionValues.push(value)

      // Найти торговое предложение по максимальному сходству параметров
      const selectedOffer = findOffer(selectedOptionValues)

      set({ selectedOptionValues, selectedOffer })
    },

    isAllOptionsSelected(selectedOptionValues) {
      return selectableOptions.every((selectableOption) =>
        selectedOptionValues
          .map((optionValue) => optionValue.optionId)
          .includes(selectableOption.id)
      )
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
