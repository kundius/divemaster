'use client'

import { diving } from '@/components/site/Header/menu'
import { Button, ButtonLoadingIcon } from '@/components/ui/button'
import { CreateablePicker, CreateablePickerItem } from '@/components/ui/createable-picker'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { apiPatch } from '@/lib/api'
import { withClientAuth } from '@/lib/api/with-client-auth'
import { colors } from '@/lib/colors'
import { PropertyEntity, PropertyType } from '@/types'
import { useToggle } from '@reactuses/core'
import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { toast } from 'sonner'
import useSWR from 'swr'

interface OptionsControlProps {
  optionId: number
  value: CreateablePickerItem[]
  onChange: (value: CreateablePickerItem[]) => void
}

function OptionsControl({ optionId, value, onChange }: OptionsControlProps) {
  const valuesQuery = useSWR<string[]>(`properties/${optionId}/suggestions`)

  return (
    <CreateablePicker
      options={valuesQuery.data?.map((item) => ({ label: item, value: item })) || []}
      value={value}
      onChange={onChange}
    />
  )
}

export type OptionType = number | number[] | boolean | boolean[] | string | string[] | undefined

export type OptionsType = Record<string, OptionType>

export interface ProductOptionsProps {
  productId: number
  properties: PropertyEntity[]
  initialOptions: OptionsType
}

export function ProductOptions({ productId, properties, initialOptions }: ProductOptionsProps) {
  const [options, setOptions] = useState<OptionsType>(initialOptions)
  const [pending, pendingToggle] = useToggle(false)

  const renderControl = (property: PropertyEntity) => {
    const onChange = (value: OptionType) => {
      setOptions((prev) => ({ ...prev, [property.key]: value }))
    }

    const value = options[property.key]

    switch (property.type) {
      case PropertyType.COMBOBOOLEAN:
        return (
          <Switch
            checked={(value as boolean | undefined) || false}
            onCheckedChange={onChange}
            name="test"
          />
        )

      // case OptionType.COMBOBOX:
      //   return (
      //     <Input
      //       value={(value as string | undefined) || ''}
      //       onChange={(e) => onChange(e.target.value)}
      //     />
      //   )

      case PropertyType.COMBOCOLORS:
        return (
          <CreateablePicker
            options={colors.map((item) => ({
              label: (
                <div className="flex gap-2 items-center">
                  <div
                    className="w-3 h-3 rounded shadow-sm"
                    style={{ backgroundColor: item.color }}
                  />
                  <div>{item.name}</div>
                </div>
              ),
              value: item.name
            }))}
            value={
              (value as string[] | undefined)?.map((item) => ({
                value: item,
                label: (
                  <div className="flex gap-2 items-center">
                    <div
                      className="w-2 h-2 rounded-full shadow-sm"
                      style={{
                        background:
                          colors.find((color) => color.name === item)?.color ||
                          'linear-gradient(53deg, rgb(169, 0, 131) 0%, rgb(160, 45, 250) 100%)'
                      }}
                    />
                    <div>{item}</div>
                  </div>
                )
              })) || []
            }
            onChange={(selectedItems) => onChange(selectedItems.map((item) => item.value))}
          />
        )

      case PropertyType.COMBOOPTIONS:
        return (
          <OptionsControl
            optionId={property.id}
            value={
              (value as string[] | undefined)?.map((item) => ({ value: item, label: item })) || []
            }
            onChange={(selectedItems) => onChange(selectedItems.map((item) => item.value))}
          />
        )

      case PropertyType.NUMBERFIELD:
        return (
          <Input
            type="number"
            value={(value as number | undefined) || ''}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
          />
        )

      // case OptionType.TEXTAREA:
      //   return (
      //     <Textarea
      //       value={(value as string | undefined) || ''}
      //       onChange={(e) => onChange(e.target.value)}
      //     />
      //   )

      case PropertyType.TEXTFIELD:
        return (
          <Input
            value={(value as string | undefined) || ''}
            onChange={(e) => onChange(e.target.value)}
          />
        )
    }
  }

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    pendingToggle()

    try {
      await apiPatch(`products/${productId}/options`, options, withClientAuth())
      toast.success('Сохранено')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Unknown error')
    }

    pendingToggle()
  }

  return (
    <form onSubmit={submitHandler} className="space-y-6">
      {properties.map((property) => (
        <div className="space-y-2" key={property.id}>
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {property.caption}
          </label>
          <div className="w-full">{renderControl(property)}</div>
        </div>
      ))}
      <div className="p-5 rounded-md flex items-center justify-end gap-4 bg-neutral-50">
        <Link href="/dashboard/products">
          <Button type="button" variant="outline">
            Отмена
          </Button>
        </Link>
        <Button type="submit" disabled={pending}>
          {pending && <ButtonLoadingIcon />}
          Сохранить
        </Button>
      </div>
    </form>
  )
}
