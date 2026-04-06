'use client'

import { useProductStore } from '@/providers/product-store-provider'

import styles from './Title.module.css'

export function Title() {
  const { product, offer: selectedOffer } = useProductStore((state) => state)
  return (
    <h1 className={styles.title} itemProp="name">
      {selectedOffer?.title ? selectedOffer.title : product.title}
    </h1>
  )
}
