import { cn } from '@/lib/utils'
import styles from './ListActions.module.scss'

export function ListActions() {
  return (
    <div className={styles.wrap}>
      <button type="button" className={cn(styles.action, styles['action-favorite'])}></button>
      <button type="button" className={cn(styles.action, styles['action-compare'])}></button>
    </div>
  )
}
