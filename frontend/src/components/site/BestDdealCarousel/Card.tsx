import { cn, formatPrice } from '@/lib/utils'
import styles from './Card.module.scss'
import Image from 'next/image'

export interface CardProps {
  images: string[]
  hit: boolean
  new: boolean
  discount: number
  price: number
  oldPrice?: number
  title: string
  brand: string
  colors: string[]
  sizes: string[]
}

export function Card(props: CardProps) {
  return (
    <div className={styles.root}>
      <div className={styles.thumb}>
        <Image src={props.images[0]} alt={props.title} fill className={styles.thumbImage} />
        <div className={styles.meta}>
          <div className={styles.hit}>Хит</div>
          <div className={styles.new}>New!</div>
          <div className={styles.discount}>-{props.discount}%</div>
        </div>
      </div>
      <div className={styles.prices}>
        <div className={styles.realPrice}>{formatPrice(props.price)}</div>
        {props.oldPrice && <div className={styles.oldPrice}>{formatPrice(props.oldPrice)}</div>}
      </div>
      <a href="#" className={styles.title}>
        {props.title}
      </a>
      <div className={styles.brand}>{props.brand}</div>
      <div className={styles.sizes}>
        {props.sizes.map((item, i) => (
          <div className={styles.size} key={i}>
            <label className={styles.sizeLabel}>
              <input className={styles.sizeRadio} type="radio" name="size" value={item} />
              <span className={styles.sizeTitle}>{item}</span>
            </label>
          </div>
        ))}
      </div>
      <div className={styles.actions}>
        <button type="button" className={cn(styles.action, styles['action-favorite'])}></button>
        <button type="button" className={cn(styles.action, styles['action-compare'])}></button>
      </div>
      <div className={styles.colors}>
        {props.colors.map((color) => (
          <div className={styles.color} key={color} style={{ backgroundColor: color }} />
        ))}
      </div>
      <div className={styles.purchaseActions}>
        <button className={cn(styles.purchaseAction, styles.purchaseActionCart)}>В корзину</button>
        <button className={cn(styles.purchaseAction, styles.purchaseActionOneClick)}>Купить в 1 клик</button>
      </div>
    </div>
  )
}
