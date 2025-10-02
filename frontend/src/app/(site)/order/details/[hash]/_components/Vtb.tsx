'use client'

import Link from 'next/link'

import { Button } from '@/components/ui/button'

export interface VtbProps {
  link: string
}

export function Vtb({ link }: VtbProps) {
  return (
    <Button className="w-full uppercase font-sans-narrow" size="lg" asChild>
      <Link href={link}>Перейти к оплате</Link>
    </Button>
  )
}
