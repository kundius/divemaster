import { SpriteIcon } from '@/components/SpriteIcon'
import { PickupPointEntity } from '@/types'
import css from './PointsItem.module.scss'
import { Button } from '@/components/ui/button'
import { PointsDetails } from './PointsDetails'

export interface PointsItemProps {
  entity: PickupPointEntity
  open?: boolean
  onOpen?: () => void
  onSelect?: () => void
}

export function PointsItem({ entity, onOpen, onSelect, open = false }: PointsItemProps) {
  return (
    <div>
      <div className={css.wrap} onClick={() => onOpen?.()}>
        <div className={css.headline}>
          <div className={css.icon}>
            <SpriteIcon name={`pickup-${entity.type}`} size={32} />
          </div>
          <div className={css.title}>{entity.fullAddress}</div>
        </div>
        <div className={css.description}>{entity.note}</div>
        <div className={css.timetable}>{entity.workTime}</div>
      </div>

      <div className="min-h-full flex flex-col">
        <div className="pt-4">
          <div className={css.labels}>
            {entity.haveCash && <div className={css.label}>Принимают наличные</div>}
            {entity.haveCashless && <div className={css.label}>Принимают карты</div>}
            {entity.allowedCod && <div className={css.label}>Наложенный платеж</div>}
            {entity.isReception && <div className={css.label}>Приём заказов</div>}
            {entity.isDressingRoom && <div className={css.label}>Примерка</div>}
          </div>
        </div>
        <div className="flex-grow" />
        <div className="mt-6">
          <Button
            onClick={() => {
              onSelect?.()
              // orderState.setDelivery({
              //   service: DeliveryService.Pickup,
              //   address: selected.fullAddress,
              //   properties: {
              //     pickupPointId: selected.id
              //   }
              // })
              // router.push('/order')
            }}
            variant="default"
            size="lg"
            className="w-full uppercase font-sans-narrow"
          >
            Заберу отсюда
          </Button>
        </div>
      </div>
    </div>
  )
}
