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

export interface ProductOffersProps {
  productId: number
  initialOffers: OfferEntity[]
  initialOptions: OptionEntity[]
}

export function ProductOffers({ productId, initialOffers, initialOptions }: ProductOffersProps) {
  console.log(initialOptions)
  return (
    <div className="space-y-6">
      <div className="p-5 rounded-md flex items-center justify-end gap-4 bg-neutral-50">
        <ProductOffersCreateDialog productId={productId} options={initialOptions}>
          <Button>Добавить вариант</Button>
        </ProductOffersCreateDialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Название</TableHead>
            {initialOptions.map((option) => (
              <TableHead key={option.id}>{option.caption}</TableHead>
            ))}
            <TableHead>Цена</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">INV001</TableCell>
            {initialOptions.map((option) => (
              <TableCell key={option.id}>{option.caption}</TableCell>
            ))}
            <TableCell>$250.00</TableCell>
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
        </TableBody>
      </Table>

      {/* <div className="rounded-xl border bg-card text-card-foreground p-4 flex flex-col gap-4">
        <div className="flex gap-2 items-center">
          <Input placeholder="Название" />
          <Input placeholder="Цена" />
          <Button>Сохранить</Button>
        </div>
        <div className="flex gap-2 items-center">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div> */}
    </div>
  )
}
