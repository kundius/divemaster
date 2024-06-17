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
import { OptionEntity, OptionType, OptionValueEntity } from '@/types'
import { ChevronUpDownIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import useSWR from 'swr'

interface FieldProps {
  title: string
}

function BooleanField({ title }: FieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {title}
      </label>
      <div className="w-full">
        <Switch />
      </div>
    </div>
  )
}

function TextField({ title }: FieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {title}
      </label>
      <div className="w-full">
        <Input />
      </div>
    </div>
  )
}

const fields = {
  [OptionType.BOOLEAN]: BooleanField,
  [OptionType.COLOR]: TextField,
  [OptionType.NUMBER]: TextField,
  [OptionType.OPTIONS]: TextField,
  [OptionType.SIZE]: TextField,
  [OptionType.TEXT]: TextField
}

export interface ProductOptionsProps {
  productId: number
}

export function ProductOptions({ productId }: ProductOptionsProps) {
  const productOptionsQuery = useSWR<OptionEntity[]>(`products/${productId}/options`)
  console.log(productOptionsQuery.data)
  return (
    <div className="space-y-6">
      {productOptionsQuery.data?.map(
        (item) => {
          const Component = fields[item.type]
          return <Component title={item.caption} key={item.id} />
        }
        // (
        //   <div className="space-y-2" key={item.id}>
        //     <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        //     {item.caption}
        //     </label>
        //     <Input />
        //   </div>
        //   // <OptionVariant
        //   //   key={item.id}
        //   //   optionId={item.id}
        //   //   productId={productId}
        //   //   title={item.caption}
        //   // />
        // )
      )}
      <div className="p-5 rounded-md flex items-center justify-end gap-4 bg-neutral-50">
        <Link href="/admin/products">
          <Button type="button" variant="outline">
            Отмена
          </Button>
        </Link>
        <Button type="submit">Сохранить</Button>
      </div>
    </div>
  )
}
