import { useToggle } from '@reactuses/core'
import Image from 'next/image'
import { PropsWithChildren, ReactNode, useMemo, useTransition } from 'react'
import { toast } from 'sonner'
import { Slot } from '@radix-ui/react-slot'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { apiPost } from '@/lib/api'
import { cn, getFileUrl } from '@/lib/utils'
import { useProductStore } from '@/providers/product-store-provider'
import { useCartStore } from '@/providers/cart-store-provider'

import css from './index.module.css'
import { PrimaryButton, PrimaryButtonArrow, PrimaryButtonSpinner } from '../site/PrimaryButton'
import { LabeledInput } from '../LabeledInput'
import { ProductBuyDialog } from '../ProductBuyDialog'
import { SelectOption } from './SelectOption'
import { Button } from '../ui/button'
import { SpriteIcon } from '../SpriteIcon'

export function AddToCartDialog({
  children,
  requestButton
}: PropsWithChildren<{ requestButton: ReactNode }>) {
  const [show, _toggleShow] = useToggle(false)
  const productStore = useProductStore((state) => state)
  const addToCart = useCartStore((state) => state.addToCart)

  const toggleShow = (val: boolean) => {
    if (!val) {
      productStore.reset()
    }
    _toggleShow(val)
  }

  const thumbnail = useMemo(() => {
    const image = productStore.product.images?.[0]

    if (!image) {
      return '/noimage.png'
    }

    return getFileUrl(image.fileId)
  }, [productStore.product])

  const addHandler = () => {
    addToCart({
      id: productStore.product.id,
      options: productStore.selected
    })
    toast.success('Товар добавлен в корзину')
    toggleShow(false)
  }

  if (!productStore.product.offers || !productStore.product.offers.length) {
    return <ProductBuyDialog title="Заказать от 1 дня">{requestButton}</ProductBuyDialog>
  }

  // Если выбрано предложение и нет опций для выбора то сразу добавляем в корзину
  if (!!productStore.offer && productStore.selectable.length === 0) {
    return <Slot onClick={addHandler}>{children}</Slot>
  }

  const price = productStore.displayPrice(productStore.offer)
  const oldPrice = productStore.displayOldPrice(productStore.offer)

  return (
    <Dialog open={show} onOpenChange={toggleShow}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-96 md:p-8 md:gap-8 md:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>Выберите параметры</DialogTitle>
        </DialogHeader>
        {productStore.selectable.length > 0 && (
          <div className="space-y-6">
            {productStore.selectable.map(({ property, options }) => (
              <SelectOption
                key={property.id}
                caption={property.caption}
                values={options}
                onSelect={(value) => productStore.selectOption(property.key, value)}
                selected={productStore.selected[property.key]}
              />
            ))}
          </div>
        )}
        <div className="bg-neutral-50 flex gap-4 items-center p-4 rounded-xl max-md:gap-2 max-md:p-2">
          <div className="flex w-20 h-20 relative shrink-0 bg-white rounded-lg max-md:w-16 max-md:h-16">
            <Image
              src={thumbnail}
              alt={productStore.product.title}
              fill
              className="rounded-lg object-contain"
            />
          </div>
          <div>
            <div className="text-base font-bold text-balance max-md:text-sm">
              {productStore.offer?.title || productStore.product.title}
            </div>
            <div className="flex items-center flex-wrap gap-4 mt-2 max-md:gap-2 max-md:mt-1">
              <div className="text-primary text-lg font-bold max-md:text-base">{price}</div>
              {oldPrice && (
                <div className="text-neutral-400 text-base line-through max-md:text-xs">
                  {oldPrice}
                </div>
              )}
            </div>
          </div>
        </div>
        <DialogFooter className="flex gap-2">
          <DialogClose asChild>
            <Button className="w-full" size="lg" variant="secondary">
              Отмена
            </Button>
          </DialogClose>
          {!productStore.isAllOptionsSelected(productStore.selected) ? (
            <Button className="w-full" size="lg" disabled key="available">
              <SpriteIcon name="cart" size={19} className="mr-2 -ml-2" />
              Выберите параметры
            </Button>
          ) : productStore.offer ? (
            <Button className="w-full" size="lg" onClick={addHandler} key="available">
              <SpriteIcon name="cart" size={19} className="mr-2 -ml-2" />В корзину
            </Button>
          ) : (
            <div className="w-full">
              <ProductBuyDialog title="Заказать от 1 дня">
                <Button className="w-full leading-none" size="lg">
                  <SpriteIcon name="one-click" size={22} className="mr-2 -ml-2" />
                  Заказать
                </Button>
              </ProductBuyDialog>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
