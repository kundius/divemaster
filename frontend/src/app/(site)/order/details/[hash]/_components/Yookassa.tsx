'use client'

import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { useCountDown } from '@reactuses/core'
import { useOrderDetails } from './OrderDetailsProvider'
import Link from 'next/link'

export function Yookassa() {
  const orderDetails = useOrderDetails()
  const now = new Date()
  const toRedirect = new Date()
  toRedirect.setSeconds(now.getSeconds() + 3)
  const diffInSec = Math.floor((toRedirect.getTime() - now.getTime()) / 1000)

  const [_, __, second] = useCountDown(diffInSec, undefined, () => {
    if (orderDetails.data.payment.link) {
      console.log('open', orderDetails.data.payment.link)
      // window.open(orderDetails.data.payment.link, '_self')
    }
  })

  return (
    <div className="flex flex-col items-center">
      <Button className="w-full uppercase font-sans-narrow" size="lg" asChild>
        <Link href={orderDetails.data.payment.link || '#'} target="_blank">
          Перейти к оплате
        </Link>
      </Button>
      {second === '00' ? (
        <div className="mt-2 text-sm text-center text-balance">
          автоматически открыть не&nbsp;удалось,
          <br /> нажмите на&nbsp;кнопку
        </div>
      ) : (
        <div className="mt-2 text-sm text-center text-balance">
          откроется автоматически через {second} сек.
        </div>
      )}
    </div>
  )
}
