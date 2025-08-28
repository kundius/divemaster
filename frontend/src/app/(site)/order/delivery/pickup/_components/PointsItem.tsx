import { SpriteIcon } from '@/components/SpriteIcon'
import { PickupPointEntity } from '@/types'
import css from './PointsItem.module.css'
import { Button } from '@/components/ui/button'
import { PointsDetails } from './PointsDetails'
import { cn } from '@/lib/utils'
import { MouseEvent, MouseEventHandler, useEffect, useRef } from 'react'

function findClosestScrollableParent(element: HTMLElement | null): HTMLElement | null {
  let currentElement: HTMLElement | null = element

  while (currentElement && currentElement !== document.body) {
    const style = window.getComputedStyle(currentElement)

    if (
      (style.overflow === 'auto' || style.overflow === 'scroll') &&
      (currentElement.scrollHeight > currentElement.clientHeight ||
        currentElement.scrollWidth > currentElement.clientWidth)
    ) {
      return currentElement
    }

    currentElement = currentElement.parentElement
  }

  return null
}

export interface PointsItemProps {
  entity: PickupPointEntity
  open?: boolean
  onOpen?: () => void
  onSelect?: () => void
}

export function PointsItem({ entity, onOpen, onSelect, open = false }: PointsItemProps) {
  const itemRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const itemNode = itemRef.current

    if (!itemNode) return

    const scrollableParent: HTMLElement | null = findClosestScrollableParent(itemNode)

    if (!scrollableParent) return

    const targetRect = itemNode.getBoundingClientRect()
    const containerRect = scrollableParent.getBoundingClientRect()

    const offsetTop = targetRect.top - containerRect.top

    if (scrollableParent) {
      scrollableParent.scrollTo({
        behavior: 'smooth',
        top: scrollableParent.scrollTop + offsetTop,
        left: 0
      })
    }
  }, [open])

  return (
    <div
      className={cn(css.wrap, {
        [css.wrapOpened]: open
      })}
      onClick={() => onOpen?.()}
      ref={itemRef}
    >
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
