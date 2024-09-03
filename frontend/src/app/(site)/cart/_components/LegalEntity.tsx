'use client'

import { Switch } from '@/components/ui/switch'
import styles from './LegalEntity.module.scss'

export function LegalEntity() {
  return (
    <label className={styles.wrap}>
      <span className={styles.label}>Юридическое лицо</span>
      <span className={styles.control}>
        <Switch />
      </span>
    </label>
  )
}
