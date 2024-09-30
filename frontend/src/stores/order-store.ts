import { persist } from 'zustand/middleware'
import { createStore } from 'zustand/vanilla'

import type { DeliveryService, PaymentService } from '@/types'

export type OrderState = {
  agreement: boolean
  personalDiscount: boolean
  legalEntity: boolean
  delivery?: {
    service: DeliveryService
    address: string
    properties: Record<string, unknown>
  }
  payment?: {
    service: PaymentService
  }
  recipient?: {
    name: string
    phone: string
    email: string
  }
  errors: {
    field: string
    message: string
  }[]
}

export type OrderActions = {
  agreementToggle(agreement: boolean): void
  setDelivery(delivery: OrderState['delivery']): void
  setRecipient(recipient: OrderState['recipient']): void
  setPayment(payment: OrderState['payment']): void
  personalDiscountToggle(personalDiscount: boolean): void
  legalEntityToggle(legalEntity: boolean): void
  validate(): boolean
}

export const createOrderStore = () =>
  createStore<OrderState & OrderActions>()(
    persist(
      (set, get) => ({
        agreement: false,
        delivery: undefined,
        recipient: undefined,
        payment: undefined,
        personalDiscount: false,
        legalEntity: false,
        errors: [],

        legalEntityToggle(legalEntity) {
          set({ legalEntity })
        },

        validate() {
          const state = get()

          let errors: OrderState['errors'] = []

          if (!state.delivery) {
            errors.push({
              field: 'delivery',
              message: 'Выберите способ получения'
            })
          }

          if (
            !state.recipient ||
            !state.recipient.email ||
            !state.recipient.name ||
            !state.recipient.phone
          ) {
            errors.push({
              field: 'recipient',
              message: 'Укажите данные получателя'
            })
          }

          if (!state.payment) {
            errors.push({
              field: 'payment',
              message: 'Выберите способ оплаты'
            })
          }

          set({ errors })

          return errors.length === 0
        },

        personalDiscountToggle(personalDiscount) {
          set({ personalDiscount })
        },

        agreementToggle: (agreement) => {
          set({ agreement })
        },

        setDelivery(delivery) {
          set((prev) => ({
            delivery,
            errors: prev.errors.filter((error) => error.field !== 'delivery')
          }))
        },

        setRecipient(recipient) {
          set((prev) => ({
            recipient,
            errors: prev.errors.filter((error) => error.field !== 'recipient')
          }))
        },

        setPayment(payment) {
          set((prev) => ({
            payment,
            errors: prev.errors.filter((error) => error.field !== 'payment')
          }))
        }
      }),
      {
        name: 'order-storage',
        partialize: ({ errors, ...state }) => state
      }
    )
  )
