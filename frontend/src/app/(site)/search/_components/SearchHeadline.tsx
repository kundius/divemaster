'use client'

import { Headline } from '@/components/Headline'
import { useProductsStore } from '@/providers/products-store-provider'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

export function SearchHeadline() {
  const searchParams = useSearchParams()
  const total = useProductsStore((store) => store.data.total)

  const title = useMemo(() => {
    const query = searchParams.get('query')
    if (query) {
      return `Поиск по запросу "${query}"`
    }
    return 'Поиск'
  }, [searchParams])

  return <Headline separator title={title} description={`${total} товаров найдено`} />
}
