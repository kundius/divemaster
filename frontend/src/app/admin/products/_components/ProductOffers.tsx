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
import { OfferEntity } from '@/types'
import { XMarkIcon } from '@heroicons/react/24/outline'

export interface ProductOffersProps {
  productId: number
  initialOffers: OfferEntity[]
}

export function ProductOffers({ productId, initialOffers }: ProductOffersProps) {
  console.log(initialOffers)
  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card text-card-foreground p-4 flex flex-col gap-4">
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
      </div>
    </div>
  )
}
