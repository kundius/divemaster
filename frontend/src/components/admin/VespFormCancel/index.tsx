'use client'

import { Button, ButtonProps } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useFormContext } from 'react-hook-form'

export function VespFormCancel(props: Omit<ButtonProps, 'loading' | 'type' | 'onClick'>) {
  const form = useFormContext()
  const route = useRouter()

  const clickHandler = () => {
    route.back()
  }

  return (
    <Button
      loading={form.formState.isSubmitting}
      type="button"
      onClick={clickHandler}
      variant={props.variant || 'secondary'}
      {...props}
    >
      {props.children || 'Отмена'}
    </Button>
  )
}
