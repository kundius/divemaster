'use client'

import { DataTable, DataTableColumn } from '@/components/admin/DataTable'
import { FilterField } from '@/components/admin/Filter'
import { PageHeaderProps } from '@/components/admin/PageHeader'
import { ApiRemoveDialog } from '@/components/lib/ApiRemoveDialog'
import { useApiTable } from '@/components/lib/ApiTable'
import { Button } from '@/components/ui/button'
import { ProductEntity } from '@/types'
import { CheckCircleIcon, XCircleIcon, PencilIcon } from '@heroicons/react/24/outline'
import { TrashIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { data } from 'tailwindcss/defaultTheme'
import { useResorces } from '@/components/lib/Resources'
import { ProductCard } from '../ProductCard'
import { getFileUrl } from '@/lib/utils'

export function Products() {
  const { total, rows } = useResorces<ProductEntity>()

  // console.log(rows)

  return (
    <div className="grid grid-cols-4 gap-4">
      {rows.map((item) => (
        <ProductCard
          key={item.id}
          id={item.id}
          title={item.title}
          price={item.price}
          favorite={item.favorite}
          recent={item.recent}
          oldPrice={item.oldPrice || undefined}
          images={item.images ? item.images.map((item) => getFileUrl(item.file)) : []}
          brand={
            item.brand !== null && typeof item.brand === 'object' ? item.brand.title : undefined
          }
        />
      ))}
    </div>
  )
}
