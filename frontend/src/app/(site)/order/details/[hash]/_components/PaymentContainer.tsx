'use client'

import useSWR from 'swr'

import { SpriteIcon } from '@/components/SpriteIcon'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { OrderEntity, PaymentService } from '@/types'

import { PaidCanceled } from './PaidCanceled'
import { PaidPeending } from './PaidPeending'
import { PaidSuccess } from './PaidSuccess'
import { UponCash } from './UponCash'
import { Yookassa } from './Yookassa'
import { Vtb } from './Vtb'

export interface PaymentContainerProps {
  hash: string
}

export function PaymentContainer({ hash }: PaymentContainerProps) {
  const { data, mutate, isLoading } = useSWR<OrderEntity>([`orders/hash:${hash}`, {}])

  const refetch = () => mutate(data, { revalidate: true })

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/5" />
        <Skeleton className="h-4 w-2/5" />
      </div>
    )
  }

  if (!data) {
    return (
      <Alert variant="default">
        <SpriteIcon name="exclamation-circle" size={14} />
        <AlertDescription>Не удалось загрузить информацию об оплате.</AlertDescription>
      </Alert>
    )
  }

  const renderPaid = (): React.ReactNode | null => {
    if (!data.payment) {
      throw new Error('payment not defined')
    }
    switch (data.payment.paid) {
      case null:
        return <PaidPeending onRefresh={refetch} />
      case false:
        return <PaidCanceled paidAt={data.payment.paidAt} />
      case true:
        return <PaidSuccess paidAt={data.payment.paidAt} />
    }
  }

  const renderPayment = (): React.ReactNode | null => {
    if (!data.payment) {
      throw new Error('payment not defined')
    }

    if (data.payment.paid !== null) return null

    switch (data.payment.service) {
      case PaymentService.Yookassa:
        return <Yookassa link={data.payment.link || '#'} />
      case PaymentService.Vtb:
        return <Vtb link={data.payment.link || '#'} />
      case PaymentService.UponCash:
        return <UponCash />
    }
  }

  return (
    <div className="space-y-4">
      {renderPaid()}
      {renderPayment()}
    </div>
  )
}
