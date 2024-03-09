'use client'

import { Button, ButtonProps } from '@/components/ui/button'
import { useFormContext } from 'react-hook-form'

export function VespFormSubmit(props: Omit<ButtonProps, 'loading' | 'type'>) {
  const {
    formState: { isSubmitting }
  } = useFormContext()
  return <Button loading={isSubmitting} type="submit" {...props} />
}
