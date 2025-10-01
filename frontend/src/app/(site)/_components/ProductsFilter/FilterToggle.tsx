import { Switch } from '@/components/ui/switch'
import { SwitchProps } from '@radix-ui/react-switch'
import styles from './FilterToggle.module.css'
import { ProductsToggleFilter } from '@/types'

export interface FilterToggleProps extends Pick<SwitchProps, 'checked' | 'onCheckedChange'> {
  filter: ProductsToggleFilter
}

export function FilterToggle({ filter, checked, onCheckedChange }: FilterToggleProps) {
  return (
    <div className={styles.box}>
      <div className={styles.title}>{filter.title}</div>
      <div className={styles.control}>
        <Switch checked={checked} onCheckedChange={onCheckedChange} />
      </div>
    </div>
  )
}
