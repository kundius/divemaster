import { createStore } from 'zustand/vanilla'
import { persist, createJSONStorage } from 'zustand/middleware'

import type { CityEntity } from '@/types'

export type LocationState = {
  city: CityEntity
  hasHydrated: boolean
}

export type LocationActions = {
  changeCity(city: CityEntity): void
  setHasHydrated(hasHydrated: boolean): void
}

export const defaultLocationStore: LocationState = {
  hasHydrated: false,
  city: {
    id: '9585c95b-e6d3-45f0-b05a-53dcdedd1443',
    name: 'Воронеж',
    district: 'Центральный',
    subject: 'Воронежская область',
    type: 'город',
    lat: 51.6717,
    lon: 39.2106
  }
}

export const createLocationStore = () =>
  createStore<LocationState & LocationActions>()(
    persist(
      (set, get) => ({
        ...defaultLocationStore,

        setHasHydrated: (hasHydrated) => {
          set({ hasHydrated })
        },

        changeCity(city) {
          set({ city })
        }
      }),
      {
        name: 'location-storage',
        onRehydrateStorage: (state) => {
          return () => state.setHasHydrated(true)
        }
      }
    )
  )
