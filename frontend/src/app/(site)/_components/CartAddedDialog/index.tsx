// components/dialogs/CartItemAddedDialog.tsx
'use client'

import { getFileUrl } from '@/lib/utils'
import { useCartStore } from '@/providers/cart-store-provider'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { redirect, usePathname } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export function CartAddedDialog() {
  const router = useRouter()

  const isCartAddedDialogOpen = useCartStore((s) => s.isCartAddedDialogOpen)
  const lastAddedItem = useCartStore((s) => s.lastAddedItem)
  const hideCartAddedDialog = useCartStore((s) => s.hideCartAddedDialog)

  const thumb = useMemo(() => {
    if (lastAddedItem && lastAddedItem.product && lastAddedItem.product.images) {
      return getFileUrl(lastAddedItem.product?.images?.[0].fileId)
    }
    return '/noimage.png'
  }, [lastAddedItem])

  const handleOpenChange = (open: boolean) => {
    if (!open) hideCartAddedDialog()
  }

  const handleContinueShopping = () => {
    hideCartAddedDialog()
  }

  const handleGoToCart = () => {
    hideCartAddedDialog()
    router.push('/cart')
  }

  if (!lastAddedItem) return null

  return (
    <Dialog open={isCartAddedDialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader className="flex flex-col items-center text-center gap-0">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <DialogTitle className="text-xl font-bold">Товар добавлен</DialogTitle>
          <p className="text-gray-500 text-sm">
            в{' '}
            <button
              onClick={handleGoToCart}
              type="button"
              className="text-blue-600 hover:underline"
            >
              корзину
            </button>
          </p>
        </DialogHeader>

        <div className="flex gap-4 p-4 bg-gray-50 rounded-lg min-w-0">
          <img
            src={thumb}
            alt={lastAddedItem.product?.title}
            className="w-20 h-20 object-cover rounded-md"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-medium truncate">{lastAddedItem.product?.title}</h4>
            {lastAddedItem.options && Object.keys(lastAddedItem.options).length > 0 && (
              <p className="text-sm text-gray-500">
                {lastAddedItem.options?.map((o) => o.content).join(', ')}
              </p>
            )}
            {lastAddedItem.price && (
              <p className="text-lg font-bold mt-1">
                {lastAddedItem.quantity} × {lastAddedItem.price.toLocaleString('ru-RU')} ₽
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
          <Button onClick={handleGoToCart} variant="outline" size="lg" type="button">
            Перейти в корзину
          </Button>
          <Button onClick={handleContinueShopping} size="lg" type="button">
            Продолжить покупки
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
