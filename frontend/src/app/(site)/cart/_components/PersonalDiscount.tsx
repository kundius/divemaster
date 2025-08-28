'use client'

import { Switch } from '@/components/ui/switch'
import { SwitchProps } from '@radix-ui/react-switch'

import styles from './PersonalDiscount.module.css'

export interface PersonalDiscountProps extends SwitchProps {
  discount: number
}

export function PersonalDiscount({ discount, ...props }: PersonalDiscountProps) {
  return (
    <label className={styles.wrap}>
      <span className={styles.desc}>
        Ваша персональная скидка в&nbsp;магазинах{' '}
        <span className="whitespace-nowrap">
          <strong>DiveMaster</strong> <strong>{discount}%</strong>
        </span>
      </span>
      <span className={styles.apply}>
        <span className={styles.applyLabel}>Применить персональную скидку</span>
        <span className={styles.applyControl}>
          <Switch {...props} />
        </span>
      </span>
    </label>
  )
}
