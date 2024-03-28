import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { apiGet } from '@/lib/api'
import { withToken } from '@/lib/api/with-token'
import { useAuth } from '@/lib/auth/use-auth'
import { cn } from '@/lib/utils'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline'
import { useQuery } from '@tanstack/react-query'
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { Pagination } from '../DataTable/Pagination'

interface LoadParams {
  limit?: number
  page?: number
  sort?: string
  query?: string
  dir?: string
  filter?: { [key: string]: string | string[] | undefined }
}

interface LoadData<TRow> {
  rows: TRow[]
  total: number
}

interface VespInputComboBoxProps<TRow> extends LoadParams {
  url: string
  renderText?: (row: TRow) => ReactNode
  getValue?: (row: TRow) => number
  emptyText?: string
  placeholder?: string
  value?: number
  onChange?: (value?: number) => void
}

export function VespInputComboBox<TRow extends unknown = unknown>(
  props: VespInputComboBoxProps<TRow>
) {
  const {
    url,
    filter,
    placeholder = 'Выбрать...',
    limit = 10,
    sort,
    dir,
    value: controlledValue,
    onChange: controlledOnChange
  } = props

  const buttonRef = useRef<HTMLButtonElement>(null)

  const [query, setQuery] = useState('')
  const [width, setWidth] = useState(200)
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(false)
  const [uncontrolledValue, setUncontrolledValue] = useState<number | undefined>(undefined)
  const [selected, setSelected] = useState<TRow>()

  const value = controlledValue || uncontrolledValue
  const setValue = controlledOnChange || setUncontrolledValue

  //

  const renderText: VespInputComboBoxProps<TRow>['renderText'] =
    props.renderText ||
    ((row: TRow) => {
      if (row && typeof row === 'object' && 'title' in row) {
        return String(row['title'])
      }
      throw new Error('Запись не является подходящим объектом')
    })

  const getValue: VespInputComboBoxProps<TRow>['getValue'] =
    props.getValue ||
    ((row: TRow) => {
      if (row && typeof row === 'object' && 'id' in row) {
        return Number(row['id'])
      }
      throw new Error('Запись не является подходящим объектом')
    })

  // Загрузка моделей

  const auth = useAuth()

  const loadParams: LoadParams = { limit, page, query, ...filter }
  if (sort) {
    loadParams.sort = sort
  }
  if (dir) {
    loadParams.dir = dir
  }

  const { data, isPending, error, refetch } = useQuery<LoadData<TRow>>({
    queryKey: ['VespInputComboBox', ...Object.values(loadParams)],
    queryFn: () => apiGet<LoadData<TRow>>(url, loadParams, withToken(auth.token)())
  })

  // Загрузить модель для значения по умолчанию

  const isValueWithoutSelected = !!value && !selected

  useEffect(() => {
    const load = async () => {
      setSelected(await apiGet<TRow>(`${url}/${value}`))
    }
    if (isValueWithoutSelected) {
      load()
    }
  }, [value, isValueWithoutSelected, url])

  // Рассчитать ширину поповера относительно кнопки

  const resizeHandler = () => {
    if (!buttonRef.current) return
    const { width } = buttonRef.current.getBoundingClientRect()
    setWidth(width)
  }

  useEffect(() => {
    window.addEventListener('resize', resizeHandler)
    resizeHandler()
    return () => {
      window.removeEventListener('resize', resizeHandler)
    }
  }, [])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          loading={isValueWithoutSelected}
          ref={buttonRef}
        >
          {isValueWithoutSelected ? '' : selected ? renderText(selected) : placeholder}
          <ChevronUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" style={{ width }}>
        <Command filter={() => 1}>
          <CommandInput
            placeholder={'Поиск...'}
            className="h-9"
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {data?.rows.map((row) => (
                <CommandItem
                  key={String(getValue(row))}
                  value={String(getValue(row))}
                  onSelect={(currentValue) => {
                    if (Number(currentValue) === value) {
                      setValue(undefined)
                      setSelected(undefined)
                    } else {
                      setValue(Number(currentValue))
                      setSelected(row)
                    }
                    setOpen(false)
                  }}
                >
                  {renderText(row)}
                  <CheckIcon
                    className={cn(
                      'ml-auto h-4 w-4',
                      value === getValue(row) ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        {(data?.total || 0) > limit && (
          <div className="px-1 pb-1">
            <Pagination
              showLimit={false}
              showTotal={false}
              limit={limit}
              page={page}
              total={data?.total || 0}
              onChange={(page: number, limit: number) => {
                setPage(page)
              }}
            />
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
