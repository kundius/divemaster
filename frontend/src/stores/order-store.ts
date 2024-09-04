import { createStore } from 'zustand/vanilla'
import computed from 'zustand-computed'

import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api'
import { withClientAuth } from '@/lib/api/with-client-auth'
import type { CartEntity, CartProductEntity, DeliveryMethod } from '@/types'

export type OrderState = {
  deliveryMethod?: DeliveryMethod
}

export type OrderActions = {
  changeDeliveryMethod(value?: DeliveryMethod): void
}

export const createOrderStore = () =>
  createStore<OrderState & OrderActions>()((set, get) => ({
    deliveryMethod: undefined,

    changeDeliveryMethod(deliveryMethod) {
      set({ deliveryMethod })
    }
  }))
