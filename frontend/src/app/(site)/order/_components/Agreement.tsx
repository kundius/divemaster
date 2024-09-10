'use client'

import { useOrderStore } from '@/providers/order-store-provider'

import css from './Agreement.module.scss'

export function Agreement() {
  const orderState = useOrderStore((state) => state)

  return (
    <label className={css.label}>
      <input
        type="checkbox"
        name="agreement"
        value="1"
        checked={orderState.agreement}
        onChange={(e) => orderState.agreementToggle(e.target.checked)}
        className={css.checkbox}
      />
      <span className={css.text}>
        Даю согласие Divemaster на получение информации о специальных предложениях
      </span>
    </label>
  )
}
