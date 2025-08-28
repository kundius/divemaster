'use client'

import { Switch } from '@/components/ui/switch'
import { useOrderStore } from '@/providers/order-store-provider'

import styles from './LegalEntity.module.css'

export function LegalEntity() {
  const isLegalEntity = useOrderStore((state) => state.legalEntity)
  const setIsLegalEntity = useOrderStore((state) => state.legalEntityToggle)
  return (
    <label className={styles.wrap}>
      <span className={styles.label}>Юридическое лицо</span>
      <span className={styles.control}>
        <Switch checked={isLegalEntity} onCheckedChange={setIsLegalEntity} />
      </span>
    </label>
  )
}
