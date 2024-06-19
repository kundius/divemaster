'use client'

import { Button } from '@/components/ui/button'
import { CreateablePicker } from '@/components/ui/createable-picker'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { TagsInput } from '@/components/ui/tags-input'
import { apiPatch } from '@/lib/api'
import { withClientAuth } from '@/lib/api/with-client-auth'
import { OptionEntity, OptionType } from '@/types'
import Link from 'next/link'
import { FormEvent, useState } from 'react'

interface BooleanControlProps {
  value: boolean
  onChange: (value: boolean) => void
}

function BooleanControl({ value, onChange }: BooleanControlProps) {
  return <Switch checked={value} onCheckedChange={onChange} />
}

interface TextControlProps {
  value: string
  onChange: (value: string) => void
}

function TextControl({ value, onChange }: TextControlProps) {
  return <Input value={value} onChange={(e) => onChange(e.target.value)} />
}

interface NumberControlProps {
  value?: number
  onChange: (value?: number) => void
}

function NumberControl({ value, onChange }: NumberControlProps) {
  return (
    <Input
      type="number"
      value={value || ''}
      onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
    />
  )
}

// const controls = {
//   [OptionType.BOOLEAN]: BooleanControl,
//   [OptionType.COLOR]: TextControl,
//   [OptionType.NUMBER]: TextControl,
//   [OptionType.OPTIONS]: TextControl,
//   [OptionType.SIZE]: TextControl,
//   [OptionType.TEXT]: TextControl
// }

export type ValuesType = Record<string, number | boolean | string | string[] | undefined>

export interface ProductOptionsProps {
  productId: number
  initialOptions: OptionEntity[]
  initialValues: ValuesType
}

export function ProductOptions({ productId, initialOptions, initialValues }: ProductOptionsProps) {
  const [values, setValues] = useState<ValuesType>(initialValues)

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
    if (
      item.type === OptionType.COLOR ||
      item.type === OptionType.OPTIONS ||
      item.type === OptionType.SIZE
    ) {
      const value = values[item.key] as string[] | undefined
      return (
        <CreateablePicker
          //   value={value || []}
          //   onChange={onChange}
          placeholder="Type name of fruit"
          onCreateItem={(item) => {
            onChange([...(value || []), item.value])
          }}
          items={[
            { value: 'apple', label: 'Apple' },
            { value: 'banana', label: 'Banana' },
            { value: 'mango', label: 'Mango' },
            { value: 'kiwi', label: 'Kiwi' }
          ]}
          selectedItems={value?.map((item) => ({ value: item, label: item })) || []}
          onSelectedItemsChange={(changes) =>
            onChange(changes.selectedItems.map((item) => item.value))
          }
          // suggestions={['Chocolate', 'Strawberry', 'Vanilla']}
        />
      )
    }
  }

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const response = await apiPatch(`products/${productId}/option-values`, values, withClientAuth())

    console.log(response)
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
        <Button type="submit">Сохранить</Button>
      </div>
    </form>
  )
}
