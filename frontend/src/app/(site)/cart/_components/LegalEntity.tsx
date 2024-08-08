'use client'

import { Switch } from '@/components/ui/switch'
import styles from './LegalEntity.module.scss'

export interface LegalEntityProps {
  checked?: boolean | undefined
  onCheckedChange?(checked: boolean): void
}

export function LegalEntity(props: LegalEntityProps) {
  return (
    <label className={styles.wrap}>
      <span className={styles.label}>Юридическое лицо</span>
      <span className={styles.control}>
        <Switch checked={props.checked} onCheckedChange={props.onCheckedChange} />
      </span>
    </label>
  )
}
