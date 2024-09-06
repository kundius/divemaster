import { SpriteIcon } from '@/components/SpriteIcon'

import css from './PointsItem.module.scss'

export interface PointsItemProps {
  title: string
  description: string
  timetable: string
}

export function PointsItem({ description, timetable, title }: PointsItemProps) {
  return (
    <div className={css.wrap}>
      <div className={css.headline}>
        <div className={css.icon}>
          <SpriteIcon name="logo-marker" size={32} />
        </div>
        <div className={css.title}>{title}</div>
      </div>
      <div className={css.description}>{description}</div>
      <div className={css.timetable}>{timetable}</div>
    </div>
  )
}
