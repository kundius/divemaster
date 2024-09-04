'use client'

import Image from 'next/image'
import { useMemo } from 'react'

import { getFileUrl } from '@/lib/utils'
import { CartProductEntity } from '@/types'

import css from './Product.module.scss'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export interface ProductProps {
  cartProduct: CartProductEntity
}

export function Product({ cartProduct }: ProductProps) {
  const thumbnail = useMemo(() => {
    if (!cartProduct.product.images || cartProduct.product.images.length === 0) {
      return '/noimage.png'
    }
    return cartProduct.product.images.map((item) => getFileUrl(item.file))[0]
  }, [cartProduct.product])

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={css.item}>
            <div className={css.image}>
              <Image
                className="object-contain"
                fill
                src={thumbnail}
                alt={cartProduct.product.title}
              />
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{cartProduct.product.title}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
