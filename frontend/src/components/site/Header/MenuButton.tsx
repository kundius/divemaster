import styles from './MenuButton.module.scss'

export function MenuButton() {
  return (
    <>
      <button className={styles.button} data-variant="close">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </>
  )
}
