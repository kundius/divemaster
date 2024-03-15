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
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'
import { VespTableData } from '../VespTable/types'
import { withToken } from '@/lib/api/with-token'
import { useAuth } from '@/lib/auth/use-auth'
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

interface VespInputComboBoxProps extends LoadParams {
  url: string
  valueField?: string
  textField?: string
  emptyText?: string
  placeholder?: string
  value?: number
  onChange?: (value?: number) => void
}

type TRow = {
  [key: string]: unknown
}

export function VespInputComboBox(props: VespInputComboBoxProps) {
  const {
    url,
    filter,
    placeholder = 'Выбрать...',
    valueField = 'id',
    textField = 'title',
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

  const loadingInitialSelected = !!value && !selected

  const loadInitialSelected = useCallback(async () => {
    const data = await apiGet<TRow>(`${url}/${value}`)
    setSelected(data)
  }, [url, value])

  useEffect(() => {
    if (loadingInitialSelected) {
      loadInitialSelected()
    }
  }, [value, selected, loadInitialSelected, loadingInitialSelected])

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
          loading={loadingInitialSelected}
          ref={buttonRef}
        >
          {loadingInitialSelected ? '' : selected ? String(selected[textField]) : placeholder}
          <ChevronUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" style={{ width }}>
        <Command filter={() => 1}>
          <CommandInput
            placeholder={"Поиск..."}
            className="h-9"
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {data?.rows.map((row) => (
                <CommandItem
                  key={String(row[valueField])}
                  value={String(row[valueField])}
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
                  {String(row[textField])}
                  <CheckIcon
                    className={cn(
                      'ml-auto h-4 w-4',
                      value === row[valueField] ? 'opacity-100' : 'opacity-0'
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
