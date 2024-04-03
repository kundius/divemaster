'use client'

import styles from './CatalogButton.module.scss'

export function CatalogButton() {
  console.log('render CatalogButton')
  return (
    <>
      <button className={styles.button}>
        Каталог<span className={styles.arrow}></span>
      </button>
    </>
  )
}
