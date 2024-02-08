'use client'

import { useFormStatus } from 'react-dom'
import { Button, ButtonProps } from '../ui/button'
import { ArrowPathIcon } from '@heroicons/react/24/outline'

export type FormSubmitButtonProps = Omit<ButtonProps, 'type' | 'aria-disabled' | 'asChild'>

export function FormSubmitButton({ children, disabled, ...props }: FormSubmitButtonProps) {
  const { pending } = useFormStatus()

  const isDisabled = pending || disabled

  return (
    <Button type="submit" aria-disabled={isDisabled} disabled={isDisabled} {...props}>
      {pending && <ArrowPathIcon className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  )
}
