'use client'

import { PaymentService } from '@/types'

import { AwaitingStatus } from './AwaitingStatus'
import { useOrderDetails } from './OrderDetailsProvider'
import { PaidStatus } from './PaidStatus'
import { UponCash } from './UponCash'
import { Yookassa } from './Yookassa'

const PaymentServiceComponents: Record<PaymentService, () => JSX.Element> = {
  [PaymentService.Yookassa]: Yookassa,
  [PaymentService.UponCash]: UponCash
}

export function Payment() {
  const orderDetails = useOrderDetails()

  const PaymentService = PaymentServiceComponents[orderDetails.data.payment.service]

  if (orderDetails.data.payment.paid) {
    return <PaidStatus />
  }

  return (
    <div className="space-y-4">
      <AwaitingStatus />
      <PaymentService />
    </div>
  )
}