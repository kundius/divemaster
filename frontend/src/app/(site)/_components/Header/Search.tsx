'use client'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn, getFileUrl } from '@/lib/utils'
import { ProductStoreProvider, useProductStore } from '@/providers/product-store-provider'
import { FindAllResult, ProductEntity } from '@/types'
import { useDebounce } from '@uidotdev/usehooks'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import useSWR from 'swr'
import styles from './Search.module.css'

export function Search() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionRefs = useRef<(HTMLLIElement | null)[]>([])

  const { data, isLoading } = useSWR<FindAllResult<ProductEntity>>(
    debouncedQuery.length
      ? [
          `products`,
          {
            query: debouncedQuery,
            limit: 5
          }
        ]
      : null
  )

  const products = data?.rows || []

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    router.push(`/search?query=${debouncedQuery}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex((prev) => (prev < products.length - 1 ? prev + 1 : prev))
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        if (highlightedIndex >= 0 && products[highlightedIndex]) {
          e.preventDefault()
          selectSuggestion(products[highlightedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        break
    }
  }

  // при выборе открываем страницу товара
  const selectSuggestion = (product: ProductEntity) => {
    setIsOpen(false)
    setHighlightedIndex(-1)
    inputRef.current?.focus()
    router.push(`/product/${product.alias}`)
  }

  // чтобы при переключении стрелками пролистывало к спрятанным строкам, хотя прокрутку я убрал и это более не нужно
  useEffect(() => {
    if (highlightedIndex >= 0 && suggestionRefs.current[highlightedIndex]) {
      suggestionRefs.current[highlightedIndex]?.scrollIntoView({
        block: 'nearest'
      })
    }
  }, [highlightedIndex])

  // добавим некоторой настойчивости, пускай открывается после загрузки при наличии товаров
  useEffect(() => {
    if (!isLoading && data && data.rows.length > 0) {
      setIsOpen(true)
    }
  }, [isLoading, data])

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            placeholder="Искать товары"
            onKeyDown={handleKeyDown}
            name="query"
            onChange={handleChange}
          />
        </PopoverTrigger>
        {products.length > 0 && (
          <PopoverContent
            className="p-0 overflow-hidden"
            style={{ width: 'var(--radix-popover-trigger-width)', minWidth: 320, zIndex: 400 }}
            align="center"
            sideOffset={8}
            onOpenAutoFocus={(e) => e.preventDefault()}
            onPointerDownOutside={() => {
              setIsOpen(false)
              setHighlightedIndex(-1)
            }}
          >
            <ul className="list-none p-0 m-0">
              {products.map((item, index) => (
                <li
                  key={item.id}
                  ref={(el) => {
                    suggestionRefs.current[index] = el
                  }}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={() => selectSuggestion(item)}
                  className={`cursor-pointer transition-colors border-b last:border-b-0 ${
                    highlightedIndex === index ? 'bg-accent' : 'hover:bg-muted'
                  }`}
                >
                  <ProductStoreProvider product={item}>
                    <SearchProduct />
                  </ProductStoreProvider>
                </li>
              ))}
            </ul>
          </PopoverContent>
        )}
      </Popover>
      <button type="submit" className={cn(styles.submit, { [styles.submitLoading]: isLoading })}>
        {isLoading ? (
          <span className="icon icon-loading animate-spin"></span>
        ) : (
          <span className="icon icon-search"></span>
        )}
      </button>
    </form>
  )
}

function SearchProduct() {
  const displayPrice = useProductStore((store) => store.displayPrice)
  const product = useProductStore((store) => store.product)

  const thumb = useMemo(() => {
    let images: string[] = []
    if (!product.images || product.images.length === 0) {
      images = ['/noimage.png']
    } else {
      images = product.images.map((item) => getFileUrl(item.fileId))
    }
    return images[0]
  }, [product])

  return (
    <div className="flex items-center gap-2 p-0">
      <div className="w-12 h-12 relative shrink-0">
        <Image src={thumb} fill alt="" className="object-cover" />
      </div>
      <div className="text-sm font-medium">{product.title}</div>
      <div className="text-sm text-primary font-medium ml-auto mr-2 shrink-0">{displayPrice()}</div>
    </div>
  )
}
