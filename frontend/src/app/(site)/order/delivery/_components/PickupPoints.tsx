'use client'

import { PickupPointEntity } from '@/types'
import useSWR from 'swr'

export function PickupPoints() {
  const query = useSWR<PickupPointEntity[]>(['pickup-point', { region: 'Иркутская область' }])
  console.log(query.data)
  return (
    <div>
      {query.data?.map((item) => (
        <div key={item.id}>{item.address}</div>
      ))}
    </div>
  )
}
