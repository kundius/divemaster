'use client'

import { cn } from '@/lib/utils'
import styles from './Item.module.scss'

export interface ItemProps {
  images: string[]
  hit: boolean
  new: boolean
  discount: number
  price: number
  title: string
  brand: string
  colors: string[]
}

export function Item(props: ItemProps) {
  return (
    <div className={styles.card}>
      <div className={styles.headline}>
        <div className={styles.meta}></div>
        <div className={styles.actions}>
          <button type="button" className={cn(styles.action, styles['action-favorite'])}></button>
          <button type="button" className={cn(styles.action, styles['action-compare'])}></button>
        </div>
      </div>
      <div className={styles.title}>{props.title}</div>
    </div>
  )
}
