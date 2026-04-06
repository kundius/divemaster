import styles from './MobileContacts.module.css'

export function MobileContacts() {
  return (
    <a href="tel:88007000354" className={styles.contacts}>
      <span className={styles.phone}>8 800 7000 354</span>
      <span className={styles.time}>ежедневно с 10:00 до 18:00</span>
      <span className={styles.icon} />
    </a>
  )
}
