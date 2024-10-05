'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export interface YandexMetrikaProps {
  code: number
}

export default function YandexMetrika({ code }: YandexMetrikaProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = `${pathname}?${searchParams}`
    ym(code, 'hit', url)
  }, [pathname, searchParams])

  return null
}
