'use client'

import { OptionEntity, OptionValueEntity } from '@/types'
import useSWR from 'swr'

export interface ProductOptionsProps {
  productId: number
}

export function ProductOptions({ productId }: ProductOptionsProps) {
  const productOptionsQuery = useSWR<OptionEntity[]>(`products/${productId}/options`)
  console.log(productOptionsQuery.data)
  return (
    <div className="bg-neutral-50 p-4 rounded-md">
      {productOptionsQuery.data?.map((item) => (
        <Group key={item.id} optionId={item.id} productId={productId} title={item.caption} />
      ))}
    </div>
  )
}

interface GroupProps {
  title: string
  optionId: number
  productId: number
}

function Group({ productId, optionId, title }: GroupProps) {
  const optionVariantsQuery = useSWR<OptionValueEntity[]>(
    `products/${productId}/options/${optionId}/variants`
  )
  console.log(optionVariantsQuery.data)
  return (
    <div>
      <div>
        <strong>{title}</strong>
      </div>
      {optionVariantsQuery.data?.map((item) => (
        <div key={item.id}>{item.value}</div>
      ))}
    </div>
  )
}
