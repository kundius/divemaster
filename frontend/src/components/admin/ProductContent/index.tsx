'use client'

export interface ProductContentProps {
  productId: number
}

export function ProductContent(props: ProductContentProps) {
  return <div>ProductContent {props.productId}</div>
}
