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

import css from './index.module.scss'
import { PrimaryButton, PrimaryButtonArrow, PrimaryButtonSpinner } from '../site/PrimaryButton'
import { LabeledInput } from '../LabeledInput'
import { ProductBuyDialog } from '../ProductBuyDialog'
import { SelectOption } from './SelectOption'
import { Button } from '../ui/button'

export function AddToCartDialog({
  children,
  requestButton
}: PropsWithChildren<{ requestButton: ReactNode }>) {
  const [show, toggleShow] = useToggle(false)
  const productStore = useProductStore((state) => state)
  const addToCart = useCartStore((state) => state.addToCart)

  const thumbnail = useMemo(() => {
    const image = productStore.product.images?.[0]

    if (!image) {
      return '/noimage.png'
    }

    return getFileUrl(image.file)
  }, [productStore.product])

  const addHandler = () => {
    addToCart({
      id: productStore.product.id,
      optionValues: Object.values(productStore.selectedOptionValues).map((item) => item.id)
    })
    toast.success('Товар добавлен в корзину')
    toggleShow(false)
  }

  if (productStore.additionalOffers.length === 0 && !productStore.basicOffer) {
    return <ProductBuyDialog title="Заказать от 1 дня">{requestButton}</ProductBuyDialog>
  }

  if (
    productStore.additionalOffers.length === 0 &&
    !!productStore.basicOffer &&
    productStore.selectableOptions.length === 0
  ) {
    return <Slot onClick={addHandler}>{children}</Slot>
  }

  return (
    <Dialog open={show} onOpenChange={toggleShow}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[640px] p-8 gap-8">
        <DialogHeader>
          <DialogTitle className="uppercase text-xl tracking-widest">
            Выберите параметры
          </DialogTitle>
        </DialogHeader>
        {productStore.selectableOptions.length > 0 && (
          <div className="space-y-6">
            {productStore.selectableOptions.map((option) => (
              <SelectOption
                key={option.id}
                caption={option.caption}
                values={option.values}
                onSelect={(value) => productStore.selectOptionValue(option, value)}
                selected={productStore.selectedOptionValues[option.key]}
              />
            ))}
          </div>
        )}
        <div className="bg-neutral-50 flex gap-4 items-center p-4 rounded-xl">
          <div className="flex w-20 h-20 relative shrink-0 bg-white rounded-lg">
            <Image
              src={thumbnail}
              alt={productStore.product.title}
              fill
              className="rounded-lg object-contain"
            />
          </div>
          <div>
            <div className="text-base font-bold leading-5">
              {productStore.selectedOffer?.title
                ? productStore.selectedOffer.title
                : productStore.product.title}
            </div>
            <div className="flex items-center gap-4 mt-2">
              <div className="text-primary text-lg font-bold">{productStore.selectedPrice}</div>
              {productStore.selectedOldPrice && (
                <div className="text-neutral-400 text-base line-through">
                  {productStore.selectedOldPrice}
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
          {productStore.allOptionsSelected && !productStore.selectedOffer ? (
            <div className="w-full">
              <ProductBuyDialog title="Заказать от 1 дня">
                <Button className="w-full leading-none" size="lg">
                  Заказать
                </Button>
              </ProductBuyDialog>
            </div>
          ) : (
            <Button
              className="w-full"
              size="lg"
              onClick={addHandler}
              disabled={!productStore.allOptionsSelected}
              key="available"
            >
              <svg viewBox="0 0 19 17" width="19" height="17" className="fill-current mr-2">
                <use href="/sprite.svg#cart"></use>
              </svg>
              В корзину
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
