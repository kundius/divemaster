import Image from 'next/image'
import styles from './Subscribe.module.css'
import Link from 'next/link'

export function Subscribe() {
  return (
    <div className={styles.root}>
      <div className={styles.title}>Будь в курсе наших новостей и событий:</div>
      <form className={styles.form}>
        <div className={styles.group}>
          <input type="text" className={styles.input} placeholder="Ваша электронная почта" />
          <button type="submit" className={styles.submit}>
            Подписаться
            <span className={styles.submitArrow} />
          </button>
        </div>
        <label className={styles.acceptance}>
          <input type="checkbox" value="1" className={styles.acceptanceInput} />
          <span className={styles.acceptanceCheckbox} />
          Согласен(-на) с{' '}
          <Link href="/info/privacy-policy" target="_blank">
            правилами пользования сайтом
          </Link>
        </label>
      </form>
    </div>
  )
}
