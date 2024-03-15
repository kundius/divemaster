'use client'

import { Button, ButtonProps } from '@/components/ui/button'
import { useFormContext } from 'react-hook-form'

export function VespFormSubmit(props: Omit<ButtonProps, 'loading' | 'type'>) {
  const form = useFormContext()
  return (
    <Button
      loading={form.formState.isSubmitting}
      type="submit"
      variant={props.variant || 'default'}
      {...props}
    >
      {props.children || 'Сохранить'}
    </Button>
  )
}
