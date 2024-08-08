'use client'

import Link from 'next/link'

import { PrimaryButton } from '@/components/site/PrimaryButton'
import { useCartStore } from '@/providers/cart-store-provider'
import { useAuthStore } from '@/providers/auth-store-provider'
import { Button } from '@/components/ui/button'

import styles from './Auth.module.scss'
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
import { OrderInfo, OrderInfoProps } from './OrderInfo'
import { Switch } from '@/components/ui/switch'

export interface AuthProps {
  checked?: boolean | undefined
  onCheckedChange?(checked: boolean): void
}

export function Auth(props: AuthProps) {
  const authUser = useAuthStore((state) => state.user)

  if (!authUser) {
    return (
      <div className={styles.wrap}>
        <div className={styles.title}>Покупайте выгодно!</div>
        <div className={styles.desc}>
          Не забудьте авторизоваться для увеличения персональной скидки и её использования
          в&nbsp;этом заказе.
        </div>
        <div className={styles.authorize}>
          <button className={styles.authorizeButton}>Авторизоваться</button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.desc}>
        Ваша персональная скидка в&nbsp;магазинах <strong>DiveMaster</strong> <strong>0%</strong>
      </div>
      <label className={styles.apply}>
        <span className={styles.applyLabel}>Применить персональную скидку</span>
        <span className={styles.applyControl}>
          <Switch checked={props.checked} onCheckedChange={props.onCheckedChange} />
        </span>
      </label>
    </div>
  )
}
