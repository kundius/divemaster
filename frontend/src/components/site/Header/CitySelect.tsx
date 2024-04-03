import styles from './CitySelect.module.scss'

export function CitySelect() {
  return (
    <button className={styles.button}>
      <span className={styles.affix}>
        <span className={styles.label}>
          Кременчуг-Константиновское
        </span>
      </span>
    </button>
  )
}
