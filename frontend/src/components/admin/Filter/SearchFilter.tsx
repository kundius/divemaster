import { Input } from '@/components/ui/input'

export interface SearchFilterProps {
  placeholder?: string
  value?: string
  onChange?: (value?: string) => void
}

export function SearchFilter(props: SearchFilterProps) {
  const { placeholder, value, onChange } = props
  return (
    <Input
      className="w-64"
      placeholder={placeholder}
      value={value || ''}
      onChange={(e) => onChange?.(e.target.value)}
    />
  )
}
