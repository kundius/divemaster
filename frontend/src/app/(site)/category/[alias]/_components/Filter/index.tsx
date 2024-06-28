import { FilterBoolean } from './FilterBoolean'
import { FilterNumber } from './FilterNumber'
import styles from './index.module.scss'

export interface FilterProps {}

export function Filter(props: FilterProps) {
  return (
    <div className={styles.container}>
      <FilterBoolean title="Товары в наличии" />
      <FilterNumber title="Цена" />
      <FilterBoolean title="Товары со скидкой" />
      <FilterBoolean title="Новинки" />
    </div>
  )
}
