'use client'

import { Button } from '@/components/ui/button'
import { CreateablePicker, CreateablePickerItem } from '@/components/ui/createable-picker'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { apiPatch } from '@/lib/api'
import { withClientAuth } from '@/lib/api/with-client-auth'
import { colors } from '@/lib/colors'
import { OptionEntity, OptionType } from '@/types'
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
  const valuesQuery = useSWR<string[]>(`options/${optionId}/values`)

  return (
    <CreateablePicker
      options={valuesQuery.data?.map((item) => ({ label: item, value: item })) || []}
      value={value}
      onChange={onChange}
    />
  )
}

export type ValuesType = Record<string, number | boolean | string | string[] | undefined>

export interface ProductOptionsProps {
  productId: number
  initialOptions: OptionEntity[]
  initialValues: ValuesType
}

export function ProductOptions({ productId, initialOptions, initialValues }: ProductOptionsProps) {
  const [values, setValues] = useState<ValuesType>(initialValues)
  const [pending, pendingToggle] = useToggle(false)

  const renderControl = (item: OptionEntity) => {
    const onChange = (value: number | boolean | string | string[] | undefined) => {
      setValues((prev) => ({ ...prev, [item.key]: value }))
    }
    if (item.type === OptionType.BOOLEAN) {
      const value = values[item.key] as boolean | undefined
      return <Switch checked={value || false} onCheckedChange={onChange} name="test" />
    }
    if (item.type === OptionType.TEXT) {
      const value = values[item.key] as string | undefined
      return <Input value={value || ''} onChange={(e) => onChange(e.target.value)} />
    }
    if (item.type === OptionType.NUMBER) {
      const value = values[item.key] as number | undefined
      return (
        <Input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
        />
      )
    }
    if (item.type === OptionType.COLOR) {
      const value = values[item.key] as string[] | undefined
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
            value?.map((item) => ({
              value: item,
              label: (
                <div className="flex gap-2 items-center">
                  <div
                    className="w-2 h-2 rounded-full shadow-sm"
                    style={{ background: colors.find((color) => color.name === item)?.color || 'linear-gradient(53deg, rgb(169, 0, 131) 0%, rgb(160, 45, 250) 100%)' }}
                  />
                  <div>{item}</div>
                </div>
              )
            })) || []
          }
          onChange={(selectedItems) => onChange(selectedItems.map((item) => item.value))}
        />
      )
    }
    if (item.type === OptionType.VARIANT || item.type === OptionType.SIZE) {
      const value = values[item.key] as string[] | undefined
      return (
        <OptionsControl
          optionId={item.id}
          value={value?.map((item) => ({ value: item, label: item })) || []}
          onChange={(selectedItems) => onChange(selectedItems.map((item) => item.value))}
        />
      )
    }
  }

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    pendingToggle()

    try {
      await apiPatch(`products/${productId}/options`, values, withClientAuth())
      toast.success('Сохранено')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Unknown error')
    }

    pendingToggle()
  }

  return (
    <form onSubmit={submitHandler} className="space-y-6">
      {initialOptions.map((item) => (
        <div className="space-y-2" key={item.id}>
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {item.caption}
          </label>
          <div className="w-full">{renderControl(item)}</div>
        </div>
      ))}
      <div className="p-5 rounded-md flex items-center justify-end gap-4 bg-neutral-50">
        <Link href="/admin/products">
          <Button type="button" variant="outline">
            Отмена
          </Button>
        </Link>
        <Button type="submit" loading={pending}>
          Сохранить
        </Button>
      </div>
    </form>
  )
}
