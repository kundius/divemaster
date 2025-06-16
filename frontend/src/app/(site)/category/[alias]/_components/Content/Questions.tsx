import styles from './Questions.module.scss'

export function Questions() {
  return (
    <div className={styles.block}>
      <div className={styles.title}>Остались вопросы?</div>
      <div className={styles.content}>
        Позвоните нам по телефону 8 800 7000 354 или напишите
        <br />
        на <a href="mailto:info@divemaster.pro">info@divemaster.pro</a>
      </div>
    </div>
  )
}
