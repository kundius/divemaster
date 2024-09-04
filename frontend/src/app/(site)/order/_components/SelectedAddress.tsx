import { SpriteIcon } from '@/components/SpriteIcon'

import css from './SelectedAddress.module.scss'

export interface SelectedAddressProps {
  title: string
  description: string
}

export function SelectedAddress({ title, description }: SelectedAddressProps) {
  return (
    <div className={css.wrapper}>
      <div className={css.icon}>
        <SpriteIcon name="delivery" size={40} />
      </div>
      <div className={css.body}>
        <div className={css.title}>{title}</div>
        <div className={css.description}>{description}</div>
      </div>
    </div>
  )
}
