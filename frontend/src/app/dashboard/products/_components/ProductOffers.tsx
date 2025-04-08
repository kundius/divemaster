'use client'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { ApiRemoveDialog } from '@/lib/ApiRemoveDialog'
import { cn } from '@/lib/utils'
import { OfferEntity, PropertyEntity } from '@/types'
import { ExclamationCircleIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useMemo } from 'react'
import useSWR from 'swr'
import { ProductOffersCreateDialog } from './ProductOffersCreateDialog'
import { ProductOffersUpdateDialog } from './ProductOffersUpdateDialog'

export interface ProductOffersProps {
  productId: number
  properties: Partial<Record<string, { property: PropertyEntity; options: string[] }>>
}

export function ProductOffers({ productId, properties }: ProductOffersProps) {
  const swrQuery = useSWR<OfferEntity[]>([`products/${productId}/offers`, {}])
  const refetch = () => swrQuery.mutate(swrQuery.data, { revalidate: true })

  const columns = useMemo(() => {
    const cls = new Set<string>()
    // сперва добавляем существующие колонки
    for (const row of Object.values(properties)) {
      if (row) {
        cls.add(row.property.key)
      }
    }
    // потом добавляем все остальные
    for (const offer of swrQuery.data || []) {
      for (const option of offer.options || []) {
        cls.add(option.name)
      }
    }
    return Array.from(cls)
  }, [swrQuery.data])

  const renderHead = (column: string) => {
    return (
      <TableHead
        key={column}
        className={cn({
          'bg-neutral-100': !properties[column]
        })}
      >
        {properties[column] ? (
          properties[column].property.caption
        ) : (
          <div className="flex gap-2 items-center">
            {column}
            <ExclamationCircleIcon className="w-5 h-5" title="Характеристика отсутствует" />
          </div>
        )}
      </TableHead>
    )
  }

  const renderCell = (offer: OfferEntity) => (column: string) => {
    const option = (offer.options || []).find((option) => option.name === column)
    const orphan =
      option && !!properties[column] && !properties[column].options.includes(option.content)
    return (
      <TableCell
        key={column}
        className={cn({
          'bg-neutral-100': orphan || (!properties[column] && option)
        })}
      >
        <div className="flex gap-2 items-center">
          {option ? option.content : '-'}
          {orphan && <ExclamationCircleIcon className="w-5 h-5" title="Значение отсутствует" />}
        </div>
      </TableCell>
    )
  }

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-md flex items-center justify-end gap-4 bg-neutral-50">
        <ProductOffersCreateDialog
          productId={productId}
          properties={properties}
          onSuccess={refetch}
        >
          <Button>Добавить вариант</Button>
        </ProductOffersCreateDialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(renderHead)}
            <TableHead>Цена</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {swrQuery.data?.map((offer) => (
            <TableRow key={offer.id}>
              {columns.map(renderCell(offer))}
              <TableCell>{offer.price}</TableCell>
              <TableCell className="w-0">
                <div className="flex gap-2">
                  <ProductOffersUpdateDialog
                    offer={offer}
                    productId={productId}
                    properties={properties}
                    onSuccess={refetch}
                  >
                    <Button variant="outline" size="sm-icon">
                      <PencilIcon className="w-4 h-4" />
                    </Button>
                  </ProductOffersUpdateDialog>
                  <ApiRemoveDialog
                    url={`products/${productId}/offers/${offer.id}`}
                    onSuccess={refetch}
                  >
                    <Button variant="destructive-outline" size="sm-icon">
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </ApiRemoveDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
