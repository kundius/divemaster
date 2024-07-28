'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { ApiRemoveDialog } from '@/lib/ApiRemoveDialog'
import { OfferEntity, OptionEntity, OptionValueEntity } from '@/types'
import { PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { ProductOffersCreateDialog } from './ProductOffersCreateDialog'
import useSWR from 'swr'
import { withClientAuth } from '@/lib/api/with-client-auth'
import { useQuery } from '@/lib/useQuery'

export interface ProductOffersProps {
  productId: number
  options: OptionEntity[]
}

export function ProductOffers({ productId, options }: ProductOffersProps) {
  const offersQuery = useQuery<OfferEntity[]>(`products/${productId}/offers`)
  return (
    <div className="space-y-6">
      <div className="p-5 rounded-md flex items-center justify-end gap-4 bg-neutral-50">
        <ProductOffersCreateDialog
          productId={productId}
          options={options}
          onSuccess={offersQuery.refetch}
        >
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
          {offersQuery.data?.map((offer) => (
            <TableRow key={offer.id}>
              {/* <TableCell className="font-medium">{offer.title}</TableCell> */}
              {options.map((option) => (
                <TableCell key={option.id}>
                  {offer.optionValues.find((item) => item.option === option.id)?.content || '-'}
                </TableCell>
              ))}
              <TableCell>{offer.price}</TableCell>
              <TableCell className="w-0">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm-icon">
                    <PencilIcon className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive-outline" size="sm-icon">
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
