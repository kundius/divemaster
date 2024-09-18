import Image from 'next/image'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { ProductBuyDialog } from '@/components/ProductBuyDialog'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { getFileUrl } from '@/lib/utils'
import { useCartStore } from '@/providers/cart-store-provider'
import { useProductStore } from '@/providers/product-store-provider'

import styles from './AddToCart.module.scss'
import { SelectOption } from './SelectOption'

export function AddToCart() {
  const {
    product,
    selectOptionValue,
    selectedOffer,
    selectedPrice,
    selectedOldPrice,
    additionalOffers,
    basicOffer,
    selectableOptions,
    selectedOptionValues,
    allOptionsSelected
  } = useProductStore((state) => state)
  const addToCart = useCartStore((state) => state.addToCart)
  const [showOptionsDialog, setShowOptionsDialog] = useState(false)

  const thumbnail = useMemo(() => {
    const image = product.images?.[0]

    if (!image) {
      return '/noimage.png'
    }

    return getFileUrl(image.file)
  }, [product])

  const addHandler = () => {
    addToCart({
      id: product.id,
      optionValues: Object.values(selectedOptionValues).map((item) => item.id)
    })
    toast.success('Товар добавлен в корзину')
    setShowOptionsDialog(false)
  }

  if (additionalOffers.length === 0 && !basicOffer) {
    return (
      <div className="w-full">
        <ProductBuyDialog title="Заказать от 1 дня">
          <button className={styles['action']}>
            <span className={styles['action-inner']}>
              <span className="text-nowrap">Заказать</span>
            </span>
          </button>
        </ProductBuyDialog>
      </div>
    )
  }

  if (additionalOffers.length === 0 && !!basicOffer && selectableOptions.length === 0) {
    return (
      <button className={styles['action']} onClick={addHandler}>
        В корзину
      </button>
    )
  }

  return (
    <Dialog open={showOptionsDialog} onOpenChange={setShowOptionsDialog}>
      <DialogTrigger className={styles['action']}>В корзину</DialogTrigger>
      <DialogContent className="sm:max-w-[640px] p-8 gap-8">
        <DialogHeader>
          <DialogTitle className="uppercase text-xl tracking-widest">
            Выберите параметры
          </DialogTitle>
        </DialogHeader>
        {selectableOptions.length > 0 && (
          <div className="space-y-6">
            {selectableOptions.map((option) => (
              <SelectOption
                key={option.id}
                caption={option.caption}
                values={option.values}
                onSelect={(value) => selectOptionValue(option, value)}
                selected={selectedOptionValues[option.key]}
              />
            ))}
          </div>
        )}
        <div className="bg-neutral-50 flex gap-4 items-center p-4 rounded-xl">
          <div className="flex w-20 h-20 relative shrink-0 bg-white rounded-lg">
            <Image src={thumbnail} alt={product.title} fill className="rounded-lg object-contain" />
          </div>
          <div>
            <div className="text-base font-bold leading-5">
              {selectedOffer?.title ? selectedOffer.title : product.title}
            </div>
            <div className="flex items-center gap-4 mt-2">
              <div className="text-primary text-lg font-bold">{selectedPrice}</div>
              {selectedOldPrice && (
                <div className="text-neutral-400 text-base line-through">{selectedOldPrice}</div>
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
          {allOptionsSelected && !selectedOffer ? (
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
              disabled={!allOptionsSelected}
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
