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

export function Products() {
  const table = useApiTable<ProductEntity>({
    url: 'products',
    defaultLimit: 24
    // initialData
  })

  return (
    <div>
      <div>
        Всего товаров: {table.data.total}
      </div>
      {table.data.rows.map((item) => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  )
}
