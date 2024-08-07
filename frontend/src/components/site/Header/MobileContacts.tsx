import styles from './MobileContacts.module.scss'

export function MobileContacts() {
  return (
    <a href="#" className={styles.contacts}>
      <span className={styles.phone}>+7 (906) 586-55-55</span>
      <span className={styles.time}>ежедневно с 10:00 до 18:00</span>
      <span className={styles.icon} />
    </a>
  )
}
