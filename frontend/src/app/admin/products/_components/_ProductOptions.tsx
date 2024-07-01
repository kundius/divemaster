'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { OptionEntity, OptionValueEntity } from '@/types'
import { ChevronUpDownIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline'
import useSWR from 'swr'

export interface ProductOptionsProps {
  productId: number
}

export function ProductOptions({ productId }: ProductOptionsProps) {
  const productOptionsQuery = useSWR<OptionEntity[]>(`products/${productId}/options`)
  return (
    <div className="space-y-6">
      {productOptionsQuery.data?.map((item) => (
        <OptionVariant
          key={item.id}
          optionId={item.id}
          productId={productId}
          title={item.caption}
        />
      ))}
      <div className="rounded-xl border bg-card text-card-foreground p-4 space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-lg font-medium">Характеристики</div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Параметр
          </label>
          <Input />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Параметр
          </label>
          <Input />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Параметр
          </label>
          <div className="w-full">
            <Switch />
          </div>
        </div>
          <Button type="submit">Сохранить</Button>
      </div>
    </div>
  )
}

interface OptionVariantProps {
  title: string
  optionId: number
  productId: number
}

function OptionVariant({ productId, optionId, title }: OptionVariantProps) {
  const optionVariantsQuery = useSWR<OptionValueEntity[]>(
    `products/${productId}/options/${optionId}/variants`
  )
  return (
    <div className="rounded-xl border bg-card text-card-foreground p-4">
      <div className="flex items-center justify-between">
        <div className="text-lg font-medium">{title}</div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              Добавить вариант
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Добавить вариант</DialogTitle>
            </DialogHeader>
            <div>
              <div className="flex gap-2">
                <Input />
                <Input />
                <Button variant="default">Добавить</Button>
              </div>
              <div className="mt-4">
                <div className="text-sm font-medium">Выбрать из списка:</div>
                <div className="mt-2 flex gap-2">
                  {['Белый', 'Черный', 'Красный'].map((item) => (
                    <Button size="sm" variant="secondary" key={item}>
                      {item}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {/* {optionVariantsQuery.data && optionVariantsQuery.data.length > 0 && ( */}
        <div className="flex flex-wrap gap-2 mt-4">
          {['Белый', 'Черный', 'Красный'].map((item) => (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-neutral-100" key={item}>
              <div className="text-sm leading-4">{item}</div>
              <button className="w-6 h-6 rounded-md flex items-center justify-center -m-1 hover:bg-slate-200 hover:">
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      {/* )} */}
    </div>
  )
}
