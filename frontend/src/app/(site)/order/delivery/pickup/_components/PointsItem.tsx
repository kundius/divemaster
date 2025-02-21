import { SpriteIcon } from '@/components/SpriteIcon'
import { PickupPointEntity } from '@/types'
import css from './PointsItem.module.scss'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useEffect, useRef } from 'react'

export interface PointsItemProps {
  entity: PickupPointEntity
  open?: boolean
  onOpen?: () => void
  onSelect?: () => void
}

export function PointsItem({ entity, onOpen, onSelect, open = false }: PointsItemProps) {
  const itemRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const itemNode = itemRef.current

    if (!itemNode) return

    if (open) {
      itemNode.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" })
    }
  }, [open])

  return (
      <div ref={itemRef} className={cn(css.wrap, {
        [css.wrapOpened]: open
      })} onClick={() => onOpen?.()}>
        <div className={css.headline}>
          <div className={css.icon}>
            <SpriteIcon name={`pickup-${entity.type}`} size={32} />
          </div>
          <div className={css.title}>{entity.fullAddress}</div>
        </div>
        <div className={css.description}>{entity.workTime}</div>
        {open && (
          <>
            <div className={css.timetable}>{entity.note}</div>
            <div className={css.labels}>
              {entity.haveCash && <div className={css.label}>Принимают наличные</div>}
              {entity.haveCashless && <div className={css.label}>Принимают карты</div>}
              {entity.allowedCod && <div className={css.label}>Наложенный платеж</div>}
              {entity.isReception && <div className={css.label}>Приём заказов</div>}
              {entity.isDressingRoom && <div className={css.label}>Примерка</div>}
            </div>
            <div className="mt-4">
              <Button
                onClick={() => onSelect?.()}
                variant="default"
                size="lg"
                className="w-full uppercase font-sans-narrow"
              >
                Заберу отсюда
              </Button>
            </div>
          </>
        )}
      </div>
  )
}
