import { DetailedHTMLProps, InputHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

import css from './index.module.css'

export interface LabeledInputProps
  extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  label: string
}

export function LabeledInput({ label, className, placeholder = '', ...props }: LabeledInputProps) {
  return (
    <label className={cn(css.input, className)}>
      <input {...props} placeholder={placeholder} className={css.control} />
      <span className={css.label}>{label}</span>
    </label>
  )
}
