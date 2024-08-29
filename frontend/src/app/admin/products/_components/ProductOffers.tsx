'use client'

import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import useSWR from 'swr'

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
import { OfferEntity, OptionEntity } from '@/types'

import { ProductOffersCreateDialog } from './ProductOffersCreateDialog'
import { ProductOffersUpdateDialog } from './ProductOffersUpdateDialog'

export interface ProductOffersProps {
  productId: number
  options: OptionEntity[]
}

export function ProductOffers({ productId, options }: ProductOffersProps) {
  const swrQuery = useSWR<OfferEntity[]>([`products/${productId}/offers`, {}])
  const refetch = () => swrQuery.mutate(swrQuery.data, { revalidate: true })
  return (
    <div className="space-y-6">
      <div className="p-5 rounded-md flex items-center justify-end gap-4 bg-neutral-50">
        <ProductOffersCreateDialog productId={productId} options={options} onSuccess={refetch}>
          <Button>Добавить вариант</Button>
        </ProductOffersCreateDialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {/* <TableHead>Название</TableHead> */}
            {options.map((option) => (
              <TableHead key={option.id}>{option.caption}</TableHead>
            ))}
            <TableHead>Цена</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {swrQuery.data?.map((offer) => (
            <TableRow key={offer.id}>
              {/* <TableCell className="font-medium">{offer.title}</TableCell> */}
              {options.map((option) => (
                <TableCell key={option.id}>
                  {offer.optionValues?.find((item) => item.option === option.id)?.content || '-'}
                </TableCell>
              ))}
              <TableCell>{offer.price}</TableCell>
              <TableCell className="w-0">
                <div className="flex gap-2">
                  <ProductOffersUpdateDialog
                    offer={offer}
                    productId={productId}
                    options={options}
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
