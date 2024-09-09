'use client'

import {
  MutableRefObject,
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useRef,
  useState
} from 'react'
import useSWR from 'swr'

import { PickupPointEntity } from '@/types'
import { useLocationStore } from '@/providers/location-store-provider'
import { string } from 'zod'

interface PointsQueryState {
  rows: PickupPointEntity[]
  selected: PickupPointEntity | null
  loading: boolean
  mapRef: MutableRefObject<any>
  setSelected(selected: PickupPointEntity | null): void
}

const PointsQueryContext = createContext<PointsQueryState | undefined>(undefined)

export function PointsQuery({ children }: PropsWithChildren) {
  const mapRef = useRef<any>()
  const [selected, setSelected] = useState<PickupPointEntity | null>(null)
  const city = useLocationStore((state) => state.city)

  const { data, isLoading } = useSWR<PickupPointEntity[]>([
    'pickup-point',
    { region: city.subject }
  ])

  const rows = useMemo(() => {
    const cityPoints = data?.filter((item) => item.cityName === city.name) || []
    if (cityPoints.length === 0) {
      return data || []
    }
    return cityPoints
  }, [data, city])

  return (
    <PointsQueryContext.Provider
      value={{ rows, loading: isLoading, mapRef, selected, setSelected }}
    >
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
