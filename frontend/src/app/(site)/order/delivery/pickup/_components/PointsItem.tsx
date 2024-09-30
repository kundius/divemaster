import { SpriteIcon } from '@/components/SpriteIcon'
import { PickupPointEntity } from '@/types'

import css from './PointsItem.module.scss'
import { usePointsQuery } from './PointsQuery'

export interface PointsItemProps {
  entity: PickupPointEntity
}

export function PointsItem({ entity }: PointsItemProps) {
  const { mapRef, setSelected } = usePointsQuery()

  const selectHandler = async () => {
    if (mapRef.current) {
      await mapRef.current.setCenter([entity.lat, entity.lon], 18)
    }
    setSelected(entity)
  }

  return (
    <div className={css.wrap} onClick={selectHandler}>
      <div className={css.headline}>
        <div className={css.icon}>
          <SpriteIcon name="logo-marker" size={32} />
        </div>
        <div className={css.title}>
          {entity.type}
          <br />
          {entity.fullAddress}
        </div>
      </div>
      <div className={css.description}>{entity.note}</div>
      <div className={css.timetable}>{entity.workTime}</div>
    </div>
  )
}
