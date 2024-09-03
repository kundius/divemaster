'use client'

import styles from './PersonalDiscount.module.scss'
import { Switch } from '@/components/ui/switch'

export interface PersonalDiscountProps {
  checked?: boolean | undefined
  onCheckedChange?(checked: boolean): void
}

export function PersonalDiscount(props: PersonalDiscountProps) {
  return (
    <label className={styles.wrap}>
      <span className={styles.desc}>
        Ваша персональная скидка в&nbsp;магазинах <strong>DiveMaster</strong> <strong>0%</strong>
      </span>
      <span className={styles.apply}>
        <span className={styles.applyLabel}>Применить персональную скидку</span>
        <span className={styles.applyControl}>
          <Switch checked={props.checked} onCheckedChange={props.onCheckedChange} />
        </span>
      </span>
    </label>
  )
}
