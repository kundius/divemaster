'use client'

import { useProductStore } from '@/providers/product-store-provider'

import styles from './Title.module.scss'

export function Title() {
  const { product, selectedOffer } = useProductStore((state) => state)
  return (
    <h1 className={styles.title}>{selectedOffer?.title ? selectedOffer.title : product.title}</h1>
  )
}
