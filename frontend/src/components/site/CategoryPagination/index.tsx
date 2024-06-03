'use client'

import { useResorces } from '@/lib/Resources'
import { Pagination as SitePagination } from '@/components/site/Pagination'

export function CategoryPagination() {
  const { params, total, setParams, listRef } = useResorces()

  const onChange = (page: number, limit: number) => {
    setParams({
      ...params,
      page,
      limit
    })
    if (listRef.current) {
      listRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  if (total <= params.limit) {
    return null
  }

  return (
    <div className="flex justify-between items-center mt-8">
      <div />
      <SitePagination limit={params.limit} page={params.page} total={total} onChange={onChange} />
    </div>
  )
}
