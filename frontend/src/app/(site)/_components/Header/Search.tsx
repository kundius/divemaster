// 'use client'

// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
// import { cn, getFileUrl } from '@/lib/utils'
// import { ProductStoreProvider, useProductStore } from '@/providers/product-store-provider'
// import { FindAllResult, ProductEntity } from '@/types'
// import { useDebounce } from '@uidotdev/usehooks'
// import Image from 'next/image'
// import { useRouter } from 'next/navigation'
// import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from 'react'
// import useSWR from 'swr'
// import styles from './Search.module.css'
// import { Button } from '@/components/ui/button'

// export function Search() {
//   const limit = 5
//   const router = useRouter()
//   const [query, setQuery] = useState('')
//   const debouncedQuery = useDebounce(query, 300)
//   const [isOpen, setIsOpen] = useState(false)
//   const [highlightedIndex, setHighlightedIndex] = useState(-1)
//   const inputRef = useRef<HTMLInputElement>(null)
//   const suggestionRefs = useRef<(HTMLLIElement | null)[]>([])

//   const { data, isLoading } = useSWR<FindAllResult<ProductEntity>>(
//     debouncedQuery.length
//       ? [
//           `products`,
//           {
//             query: debouncedQuery,
//             limit: limit
//           }
//         ]
//       : null
//   )

//   const total = data?.total || 0
//   const products = data?.rows || []

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setQuery(e.target.value)
//   }

//   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault()

//     router.push(`/search?query=${debouncedQuery}`)
//   }

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (!isOpen) return

//     switch (e.key) {
//       case 'ArrowDown':
//         e.preventDefault()
//         let maxHighlightedIndex = total > limit ? products.length : products.length - 1
//         setHighlightedIndex((prev) => (prev < maxHighlightedIndex ? prev + 1 : prev))
//         break
//       case 'ArrowUp':
//         e.preventDefault()
//         setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1))
//         break
//       case 'Enter':
//         if (highlightedIndex >= 0) {
//           e.preventDefault()
//           selectSuggestion(products[highlightedIndex])
//         }
//         break
//       case 'Escape':
//         setIsOpen(false)
//         break
//     }
//   }

//   // при выборе открываем страницу товара
//   const selectSuggestion = (product?: ProductEntity) => {
//     setIsOpen(false)
//     setHighlightedIndex(-1)
//     inputRef.current?.focus()

//     if (product) {
//       router.push(`/product/${product.alias}`)
//     } else {
//       router.push(`/search?query=${debouncedQuery}`)
//     }
//   }

//   // чтобы при переключении стрелками пролистывало к спрятанным строкам, хотя прокрутку я убрал и это более не нужно
//   useEffect(() => {
//     if (highlightedIndex >= 0 && suggestionRefs.current[highlightedIndex]) {
//       suggestionRefs.current[highlightedIndex]?.scrollIntoView({
//         block: 'nearest'
//       })
//     }
//   }, [highlightedIndex])

//   // добавим некоторой настойчивости, пускай открывается после загрузки при наличии товаров
//   useEffect(() => {
//     if (!isLoading && data && data.rows.length > 0) {
//       setIsOpen(true)
//     }
//   }, [isLoading, data])

//   return (
//     <form onSubmit={handleSubmit} className={styles.form}>
//       <Popover open={isOpen} onOpenChange={setIsOpen}>
//         <PopoverTrigger asChild>
//           <input
//             ref={inputRef}
//             type="text"
//             className={styles.input}
//             placeholder="Искать товары"
//             onKeyDown={handleKeyDown}
//             name="query"
//             onChange={handleChange}
//           />
//         </PopoverTrigger>
//         {products.length > 0 && (
//           <PopoverContent
//             className="p-2 overflow-hidden left-0 right-0"
//             style={{
//               minWidth: 320,
//               width: 'var(--radix-popover-trigger-width)',
//               zIndex: 400
//             }}
//             align="center"
//             sideOffset={8}
//             onOpenAutoFocus={(e) => e.preventDefault()}
//             onPointerDownOutside={() => {
//               setIsOpen(false)
//               setHighlightedIndex(-1)
//             }}
//           >
//             <ul className="list-none p-0 m-0 flex flex-col gap-2">
//               {products.map((item, index) => (
//                 <li
//                   key={item.id}
//                   ref={(el) => {
//                     suggestionRefs.current[index] = el
//                   }}
//                   onMouseEnter={() => setHighlightedIndex(index)}
//                   onClick={() => selectSuggestion(item)}
//                   className={`rounded-md p-1 cursor-pointer transition-colors ${
//                     highlightedIndex === index ? 'bg-accent' : 'hover:bg-muted'
//                   }`}
//                 >
//                   <ProductStoreProvider product={item}>
//                     <SearchProduct />
//                   </ProductStoreProvider>
//                 </li>
//               ))}
//               {total > limit && (
//                 <li
//                   ref={(el) => {
//                     suggestionRefs.current[products.length] = el
//                   }}
//                   onMouseEnter={() => setHighlightedIndex(products.length)}
//                   onClick={() => selectSuggestion()}
//                 >
//                   <Button
//                     className={`w-full ${
//                       highlightedIndex === products.length ? 'bg-accent' : 'hover:bg-muted'
//                     }`}
//                     variant="outline"
//                     type="button"
//                   >
//                     Показать все
//                   </Button>
//                 </li>
//               )}
//             </ul>
//           </PopoverContent>
//         )}
//       </Popover>
//       <button type="submit" className={cn(styles.submit, { [styles.submitLoading]: isLoading })}>
//         {isLoading ? (
//           <span className="icon icon-loading animate-spin"></span>
//         ) : (
//           <span className="icon icon-search"></span>
//         )}
//       </button>
//     </form>
//   )
// }

// function SearchProduct() {
//   const displayPrice = useProductStore((store) => store.displayPrice)
//   const product = useProductStore((store) => store.product)

//   const thumb = useMemo(() => {
//     let images: string[] = []
//     if (!product.images || product.images.length === 0) {
//       images = ['/noimage.png']
//     } else {
//       images = product.images.map((item) => getFileUrl(item.fileId))
//     }
//     return images[0]
//   }, [product])

//   return (
//     <div className="flex items-center gap-2 p-0">
//       <div className="w-12 h-12 relative shrink-0">
//         <Image src={thumb} fill alt="" className="object-cover rounded" />
//       </div>
//       <div className="text-sm font-medium">{product.title}</div>
//       <div className="text-sm text-primary font-medium ml-auto mr-2 shrink-0">{displayPrice()}</div>
//     </div>
//   )
// }
'use client'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn, getFileUrl } from '@/lib/utils'
import { ProductStoreProvider, useProductStore } from '@/providers/product-store-provider'
import { FindAllResult, ProductEntity } from '@/types'
import { useDebounce } from '@uidotdev/usehooks'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import useSWR from 'swr'
import styles from './Search.module.css'
import { Button } from '@/components/ui/button'
import { createPortal } from 'react-dom'
import { Container } from '@/components/Container'

export function Search() {
  const limit = 5

  const router = useRouter()
  const pathname = usePathname()

  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)

  const [offsetTop, setOffsetTop] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isOpened, setIsOpened] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionRefs = useRef<(HTMLLIElement | null)[]>([])
  const modalRef = useRef<HTMLDivElement>(null)

  const { data, isLoading } = useSWR<FindAllResult<ProductEntity>>(
    debouncedQuery.length
      ? [
          `products`,
          {
            query: debouncedQuery,
            limit: limit
          }
        ]
      : null
  )

  const total = data?.total || 0
  const products = data?.rows || []

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    router.push(`/search?query=${debouncedQuery}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpened) return

    const maxHighlightedIndex = total > limit ? products.length : products.length - 1

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex((prev) => (prev < maxHighlightedIndex ? prev + 1 : 0))
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : maxHighlightedIndex))
        break
      case 'Enter':
        if (highlightedIndex != -1) {
          e.preventDefault()
          selectSuggestion(products[highlightedIndex])
        }
        break
      case 'Escape':
        close()
        break
    }
  }

  // при выборе открываем страницу товара или страницу поиска
  const selectSuggestion = (product?: ProductEntity) => {
    close()
    setHighlightedIndex(-1)
    inputRef.current?.focus()

    if (product) {
      router.push(`/product/${product.alias}`)
    } else {
      router.push(`/search?query=${debouncedQuery}`)
    }
  }

  const open = () => {
    setIsLoaded(true)

    const headerPrimary = document.querySelector('[data-header-primary]')

    if (headerPrimary) {
      const headerPrimaryRect = headerPrimary.getBoundingClientRect()
      setOffsetTop(headerPrimaryRect.bottom)
    }

    setIsOpened(true)
  }

  const close = () => {
    setIsOpened(false)
  }

  const handlePointerDown = (event: PointerEvent) => {
    if (
      modalRef.current &&
      !modalRef.current.contains(event.target as Node) &&
      inputRef.current &&
      !inputRef.current.contains(event.target as Node)
    ) {
      close()
    }
  }

  const handleInputTrigger = () => {
    if (data && data.rows.length > 0) {
      open()
    }
  }

  useEffect(() => {
    if (isOpened) {
      document.addEventListener('pointerdown', handlePointerDown)
      window.addEventListener('scroll', close)
    } else {
      document.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('scroll', close)
    }
    return () => {
      window.removeEventListener('scroll', close)
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isOpened])

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
      open()
    }
  }, [isLoading, data])

  useEffect(() => {
    close()
  }, [pathname])

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        ref={inputRef}
        type="text"
        className={styles.input}
        placeholder="Искать товары"
        onKeyDown={handleKeyDown}
        name="query"
        onChange={handleChange}
        onFocus={handleInputTrigger}
        onClick={handleInputTrigger}
      />
      <button type="submit" className={cn(styles.submit, { [styles.submitLoading]: isLoading })}>
        {isLoading ? (
          <span className="icon icon-loading animate-spin"></span>
        ) : (
          <span className="icon icon-search"></span>
        )}
      </button>
      {isLoaded &&
        createPortal(
          <div
            className={cn(styles.modal, { [styles.opened]: isOpened })}
            style={{ '--offset-top': `${offsetTop}px` } as React.CSSProperties}
            ref={modalRef}
          >
            <div className={styles['modal-content']}>
              <Container>
                <ul className="list-none py-6 m-0 flex flex-col gap-4 max-md:py-3 max-md:gap-2">
                  {products.map((item, index) => (
                    <li
                      key={item.id}
                      ref={(el) => {
                        suggestionRefs.current[index] = el
                      }}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      onClick={() => selectSuggestion(item)}
                      className={`rounded-md p-2 cursor-pointer transition-colors max-md:p-1 ${
                        highlightedIndex === index ? 'bg-accent' : 'hover:bg-muted'
                      }`}
                    >
                      <ProductStoreProvider product={item}>
                        <SearchProduct />
                      </ProductStoreProvider>
                    </li>
                  ))}
                  {total > limit && (
                    <li
                      ref={(el) => {
                        suggestionRefs.current[products.length] = el
                      }}
                      onMouseEnter={() => setHighlightedIndex(products.length)}
                      onClick={() => selectSuggestion()}
                    >
                      <Button
                        className={`w-full ${
                          highlightedIndex === products.length ? 'bg-accent' : 'hover:bg-muted'
                        }`}
                        variant="outline"
                        type="button"
                      >
                        Показать все
                      </Button>
                    </li>
                  )}
                </ul>
              </Container>
            </div>
          </div>,
          document.body
        )}
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
    <div className="flex items-center gap-4 p-0 max-md:gap-2">
      <div className="w-16 h-16 relative shrink-0 max-md:w-12 max-md:h-12">
        <Image src={thumb} fill alt="" className="object-cover rounded" />
      </div>
      <div className="text-base font-medium max-md:text-sm">{product.title}</div>
      <div className="text-base text-primary font-medium ml-auto mr-4 shrink-0 max-md:mr-2 max-md:text-sm">
        {displayPrice()}
      </div>
    </div>
  )
}
