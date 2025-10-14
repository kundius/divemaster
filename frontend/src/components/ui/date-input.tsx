'use client'

import { format, isValid, parse } from 'date-fns'
import { ru } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { useCallback, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export interface DateInputProps {
  dateFormat?: string
  placeholder?: string
  value?: Date | null
  onChange?: (value: Date | null) => void
}

export function DateInput({
  dateFormat = 'dd MMMM, yyyy',
  placeholder,
  value: controlledValue,
  onChange: controlledOnChange
}: DateInputProps) {
  const [open, setOpen] = useState(false)
  const [uncontrolledValue, setUncontrolledValue] = useState<Date | null>(null)

  const value = controlledValue ?? uncontrolledValue
  const setValue = controlledOnChange ?? setUncontrolledValue

  const formatDate = useCallback(
    (v: Date | null) => {
      return v ? format(v, dateFormat, { locale: ru }) : ''
    },
    [dateFormat]
  )
  const parseDate = useCallback(
    (v: string) => {
      return parse(v, dateFormat, new Date(), {
        locale: ru
      })
    },
    [dateFormat]
  )

  const [month, setMonth] = useState<Date | null>(value)
  const [inputValue, setInputValue] = useState(formatDate(value))

  return (
    <div className="relative flex gap-2">
      <Input
        value={inputValue}
        placeholder={placeholder}
        className="bg-background pr-10"
        onChange={(e) => {
          setInputValue(e.target.value)
          const date = parseDate(e.target.value)
          if (isValid(date)) {
            setValue(date)
            setMonth(date)
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            setOpen(true)
          }
        }}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="absolute top-1/2 right-2 size-6 -translate-y-1/2">
            <CalendarIcon className="size-3.5" />
            <span className="sr-only">Выбрать дату</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto overflow-hidden p-0"
          align="end"
          alignOffset={-8}
          sideOffset={10}
        >
          <Calendar
            mode="single"
            selected={value ?? undefined}
            captionLayout="dropdown"
            month={month ?? undefined}
            onMonthChange={setMonth}
            onSelect={(date) => {
              setInputValue(formatDate(date ?? null))
              setValue(date ?? null)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
