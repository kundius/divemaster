'use client'

import { PointsItem } from './PointsItem'
import { usePointsQuery } from './PointsQuery'

export function PointsList() {
  const { loading, rows } = usePointsQuery()
  return (
    <div>
      {rows.map((item) => (
        <PointsItem
          key={item.id}
          description={item.note}
          timetable={item.timetable}
          title={item.address}
        />
      ))}
    </div>
  )
}
