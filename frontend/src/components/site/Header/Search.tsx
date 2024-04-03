import styles from './Search.module.scss'

export function Search() {
  return (
    <div className={styles.form}>
      <input type="text" className={styles.input} placeholder="Искать товары" />
      <button className={styles.submit}></button>
    </div>
  )
}
