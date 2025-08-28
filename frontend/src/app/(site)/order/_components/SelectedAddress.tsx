import { SpriteIcon } from '@/components/SpriteIcon'
import { ReactNode } from 'react'
import css from './SelectedAddress.module.css'

export interface SelectedAddressProps {
  title: ReactNode
  description: ReactNode
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
