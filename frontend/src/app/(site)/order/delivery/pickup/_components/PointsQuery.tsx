'use client'

import { PropsWithChildren, createContext, useContext } from 'react'
import useSWR from 'swr'

import { PickupPointEntity } from '@/types'

interface PointsQueryState {
  rows: PickupPointEntity[]
  loading: boolean
}

const PointsQueryContext = createContext<PointsQueryState>({
  rows: [],
  loading: false
})

export function PointsQuery({ children }: PropsWithChildren) {
  const query = useSWR<PickupPointEntity[]>(['pickup-point', { region: 'Воронежская область' }])
  return (
    <PointsQueryContext.Provider value={{ rows: query.data || [], loading: query.isLoading }}>
      {children}
    </PointsQueryContext.Provider>
  )
}

export function usePointsQuery() {
  const context = useContext(PointsQueryContext)

  if (!context) {
    throw new Error(`usePointsQuery must be used within PointsQuery`)
  }

  return context
}
