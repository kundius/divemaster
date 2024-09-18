'use client'

import Link from 'next/link'

import { Button } from '@/components/ui/button'

export interface YookassaProps {
  link: string
}

export function Yookassa({ link }: YookassaProps) {
  return (
    <Button className="w-full uppercase font-sans-narrow" size="lg" asChild>
      <Link href={link}>Перейти к оплате</Link>
    </Button>
  )
}
