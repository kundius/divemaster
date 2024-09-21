import { Input } from '@/components/ui/input'

export interface SearchFilterProps {
  placeholder?: string
  value?: string | null
  onChange?: (value: string | null) => void
}

export function SearchFilter(props: SearchFilterProps) {
  const { placeholder, value, onChange } = props
  return (
    <Input
      className="w-64 h-8"
      placeholder={placeholder}
      value={value || ''}
      onChange={(e) => onChange?.(e.target.value)}
    />
  )
}
