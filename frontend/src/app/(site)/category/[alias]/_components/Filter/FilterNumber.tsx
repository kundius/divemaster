import { Slider } from '@/components/ui/slider'
import styles from './FilterNumber.module.scss'

export interface FilterNumberProps {
  title: string
}

export function FilterNumber({ title }: FilterNumberProps) {
  return (
    <div className={styles.box}>
      <div className={styles.headline}>
        <div className={styles.title}>{title}</div>
        <button className={styles.reset}>Сбросить</button>
      </div>
      <div className={styles.control}>
        <Slider defaultValue={[500, 5000]} min={0} max={100000} step={1} />
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <div className={styles.label}>от</div>
          <div className={styles.field}>
            <input className={styles.input} />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className={styles.label}>до</div>
          <div className={styles.field}>
            <input className={styles.input} />
          </div>
        </div>
      </div>
    </div>
  )
}
