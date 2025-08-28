'use client'

import { useCartStore } from '@/providers/cart-store-provider'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import styles from './CartHeadline.module.css'

export function CartHeadline() {
  const total = useCartStore((state) => state.total)
  const deleteCart = useCartStore((state) => state.deleteCart)

  return (
    <div className={styles.headline}>
      <div className={styles.title}>Товары, {total.count} шт.</div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className={styles.clear} type="button">
            Удалить
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить товары</AlertDialogTitle>
            <AlertDialogDescription>
              Вы точно хотите удалить все товары?
              <br />
              Отменить данное действие будет невозможно.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={deleteCart}>Удалить</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
