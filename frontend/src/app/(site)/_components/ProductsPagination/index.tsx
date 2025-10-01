'use client'

import { Pagination as SitePagination } from '@/components/Pagination'
import { useProductsStore } from '@/providers/products-store-provider'

export function ProductsPagination() {
  const total = useProductsStore((state) => state.data.total)
  const page = useProductsStore((state) => state.searchParams.page)
  const limit = useProductsStore((state) => state.searchParams.limit)
  const onChangePagination = useProductsStore((state) => state.onChangePagination)

  if (total <= limit) {
    return null
  }

  return (
    <div className="flex justify-between items-center mt-8">
      <div />
      <SitePagination limit={limit} page={page} total={total} onChange={onChangePagination} />
    </div>
  )
}
