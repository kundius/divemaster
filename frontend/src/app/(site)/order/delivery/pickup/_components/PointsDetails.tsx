import { SpriteIcon } from '@/components/SpriteIcon'
import { PickupPointEntity } from '@/types'

import css from './PointsDetails.module.scss'

export interface PointsDetailsProps {
  entity: PickupPointEntity
}

export function PointsDetails({ entity }: PointsDetailsProps) {
  return (
    <div className={css.wrap}>
      <div className={css.content}>
        <div className={css.headline}>
          <div className={css.icon}>
            <SpriteIcon name={`pickup-${entity.type}`} size={54} />
          </div>
          <div className={css.title}>{entity.fullAddress}</div>
        </div>
        <div className={css.description}>{entity.note}</div>
        <div className={css.timetable}>{entity.workTime}</div>
      </div>
      <div className={css.labels}>
        {entity.haveCash && <div className={css.label}>Принимают наличные</div>}
        {entity.haveCashless && <div className={css.label}>Принимают карты</div>}
        {entity.allowedCod && <div className={css.label}>Наложенный платеж</div>}
        {entity.isReception && <div className={css.label}>Приём заказов</div>}
        {entity.isDressingRoom && <div className={css.label}>Примерка</div>}
      </div>
    </div>
  )
}
