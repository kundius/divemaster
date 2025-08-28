import { Pagination } from '@/components/DataTable/Pagination'
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
import { cn } from '@/lib/utils'
import { ArrowPathIcon, CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline'
import { ReactNode, useEffect, useRef, useState } from 'react'
import useSWR from 'swr'

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

interface ApiInputComboBoxProps<TRow> extends LoadParams {
  url: string
  renderText?: (row: TRow) => ReactNode
  getValue?: (row: TRow) => number
  emptyText?: string
  placeholder?: string
  value?: number | null
  onChange?: (value: number | null) => void
}

export function ApiInputComboBox<TRow extends unknown = unknown>(
  props: ApiInputComboBoxProps<TRow>
) {
  const {
    url,
    filter,
    placeholder = 'Выбрать...',
    limit = 8,
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
  const [uncontrolledValue, setUncontrolledValue] = useState<number | null>(null)
  const [selected, setSelected] = useState<TRow | null>(null)

  const value = controlledValue || uncontrolledValue
  const setValue = controlledOnChange || setUncontrolledValue

  //

  const renderText: ApiInputComboBoxProps<TRow>['renderText'] =
    props.renderText ||
    ((row: TRow) => {
      if (row && typeof row === 'object' && 'title' in row) {
        return String(row['title'])
      }
      throw new Error('Запись не является подходящим объектом')
    })

  const getValue: ApiInputComboBoxProps<TRow>['getValue'] =
    props.getValue ||
    ((row: TRow) => {
      if (row && typeof row === 'object' && 'id' in row) {
        return Number(row['id'])
      }
      throw new Error('Запись не является подходящим объектом')
    })

  // Загрузка моделей

  const loadParams: LoadParams = { limit, page, query, ...filter }
  if (sort) {
    loadParams.sort = sort
  }
  if (dir) {
    loadParams.dir = dir
  }
  const swrQuery = useSWR<LoadData<TRow>>([url, loadParams])

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
          className="w-full"
          disabled={isValueWithoutSelected}
          ref={buttonRef}
        >
          {isValueWithoutSelected && <ArrowPathIcon className="h-4 w-4 animate-spin" />}
          {isValueWithoutSelected ? 'Загрузка...' : selected ? renderText(selected) : placeholder}
          <ChevronUpDownIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" style={{ width }}>
        <Command filter={() => 1}>
          <CommandInput
            placeholder={'Поиск...'}
            className="h-9"
            value={query}
            onValueChange={(search) => {
              setQuery(search)
              setPage(1)
            }}
          />
          <CommandList>
            <CommandEmpty>Not found.</CommandEmpty>
            <CommandGroup>
              {swrQuery.data?.rows.map((row) => (
                <CommandItem
                  key={String(getValue(row))}
                  value={String(getValue(row))}
                  onSelect={(currentValue) => {
                    if (Number(currentValue) === value) {
                      setValue(null)
                      setSelected(null)
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
        {(swrQuery.data?.total || 0) > limit && (
          <div className="px-1 pb-1">
            <Pagination
              showLimit={false}
              showTotal={false}
              limit={limit}
              page={page}
              total={swrQuery.data?.total || 0}
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
