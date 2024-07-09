'use client'

import { Pagination as SitePagination } from '@/components/site/Pagination'
import { parseAsInteger, useQueryStates } from 'nuqs'
import { useProductsQuery } from '../ProductsQuery'

export function Pagination() {
  const [params, setParams] = useQueryStates({
    limit: parseAsInteger.withDefault(24),
    page: parseAsInteger.withDefault(1)
  })

  const { data, listRef } = useProductsQuery()

  const onChange = (page: number, limit: number) => {
    setParams({ page, limit })
    if (listRef.current) {
      listRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  if (data.total <= params.limit) {
    return null
  }

  return (
    <div className="flex justify-between items-center mt-8">
      <div />
      <SitePagination
        limit={params.limit}
        page={params.page}
        total={data.total}
        onChange={onChange}
      />
    </div>
  )
}
