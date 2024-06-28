import { Switch } from '@/components/ui/switch'
import styles from './FilterBoolean.module.scss'

export interface FilterBooleanProps {
  title: string
}

export function FilterBoolean({ title }: FilterBooleanProps) {
  return (
    <div className={styles.box}>
      <div className={styles.title}>{title}</div>
      <div className={styles.control}>
        <Switch />
      </div>
    </div>
  )
}
