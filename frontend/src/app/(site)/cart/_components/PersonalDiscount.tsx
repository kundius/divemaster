'use client'

import { Switch } from '@/components/ui/switch'
import { useOrderStore } from '@/providers/order-store-provider'

import styles from './PersonalDiscount.module.scss'

export function PersonalDiscount() {
  const personalDiscountEnabled = useOrderStore((state) => state.personalDiscountEnabled)
  const personalDiscountToggle = useOrderStore((state) => state.personalDiscountToggle)
  return (
    <label className={styles.wrap}>
      <span className={styles.desc}>
        Ваша персональная скидка в&nbsp;магазинах <strong>DiveMaster</strong> <strong>0%</strong>
      </span>
      <span className={styles.apply}>
        <span className={styles.applyLabel}>Применить персональную скидку</span>
        <span className={styles.applyControl}>
          <Switch checked={personalDiscountEnabled} onCheckedChange={personalDiscountToggle} />
        </span>
      </span>
    </label>
  )
}
