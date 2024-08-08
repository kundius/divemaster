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
import styles from './Headline.module.scss'

export function Headline() {
  const total = useCartStore((state) => state.total)
  const deleteCart = useCartStore((state) => state.deleteCart)

  return (
    <div className={styles.headline}>
      <div className={styles.title}>Товары, {total.count} шт.</div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className={styles.clear} type="button">
            Удалить товары
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
