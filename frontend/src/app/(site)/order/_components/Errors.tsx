'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useOrderStore } from '@/providers/order-store-provider'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'

export interface FieldErrorsProps {
  field?: string
}

export function Errors({ field }: FieldErrorsProps) {
  const errors = useOrderStore((state) => state.errors)
  const filtered =
    typeof field !== 'undefined' ? errors.filter((error) => error.field === field) : errors
  if (filtered.length === 0) return null
  return (
    <div className="grid grid-cols-1 gap-3">
      {filtered.map((item, i) => (
        <Alert variant="destructive" key={i}>
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Внимание!</AlertTitle>
          <AlertDescription>{item.message}</AlertDescription>
        </Alert>
      ))}
    </div>
  )
}
