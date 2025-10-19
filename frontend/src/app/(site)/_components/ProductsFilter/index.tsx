'use client'

import { useProductsStore } from '@/providers/products-store-provider'
import { useEffect, useMemo, useRef, useState } from 'react'
import { FilterOptions } from './FilterOptions'
import { FilterRange } from './FilterRange'
import { FilterToggle } from './FilterToggle'
import styles from './index.module.css'
import { createPortal } from 'react-dom'
import { XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn, declOfNum } from '@/lib/utils'
import { Spinner } from '@/components/ui/spinner'

export function ProductsFilter() {
  const loading = useProductsStore((state) => state.loading)
  const total = useProductsStore((state) => state.data.total)
  const filters = useProductsStore((state) => state.data.filters)
  const filter = useProductsStore((state) => state.searchParams.filter)
  const onChangeFilter = useProductsStore((state) => state.onChangeFilter)
  const stickyFilter = useProductsStore((state) => state.stickyFilter)
  const stickyFilterToggle = useProductsStore((state) => state.stickyFilterToggle)
  const containerRef = useRef<HTMLDivElement>(null)
  const portalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const containerEl = containerRef.current
    const portalEl = portalRef.current

    if (!containerEl || !portalEl) return

    const boundaryEl = containerEl.closest('[data-products-filter-boundary]')
    const offsetEl = document.querySelector('[data-header-sticky]')

    if (!boundaryEl || !offsetEl) return

    if (window.matchMedia('(min-width: 1024px)').matches) {
      const scrollHandler = () => {
        const headlineHeight = 58
        const contentPadding = 16
        let top = 0
        let bottom = 0
        let left = 0
        let right = 0

        const offsetElRect = offsetEl.getBoundingClientRect()
        const boundaryElRect = boundaryEl.getBoundingClientRect()
        const containerElRect = containerEl.getBoundingClientRect()

        top = offsetElRect.bottom + contentPadding
        left = boundaryElRect.left - contentPadding
        const boundaryTop = boundaryElRect.top - headlineHeight - contentPadding
        if (boundaryTop > top) {
          top = boundaryTop
        }
        bottom = 16
        right = window.innerWidth - containerElRect.right - contentPadding
        const boundaryBottom = boundaryElRect.bottom - window.innerHeight - contentPadding
        if (boundaryBottom < 0) {
          bottom = boundaryBottom * -1 + contentPadding
          top += boundaryBottom
        }

        portalEl.style.right = `${right}px`
        portalEl.style.bottom = `${bottom}px`
        portalEl.style.top = `${top}px`
        portalEl.style.left = `${left}px`
      }

      window.addEventListener('scroll', scrollHandler)
      window.addEventListener('resize', scrollHandler)
      scrollHandler()

      return () => {
        window.removeEventListener('scroll', scrollHandler)
        window.removeEventListener('resize', scrollHandler)
      }
    } else {
      portalEl.style.top = '0'
      portalEl.style.right = '0'
      portalEl.style.bottom = '0'
      portalEl.style.left = '0'
    }
  }, [stickyFilter])

  const parsedFilter = useMemo(() => {
    try {
      return JSON.parse(filter) as Record<string, any>
    } catch {
      return {}
    }
  }, [filter])

  const changeHandler = (key: string, value: any) => {
    onChangeFilter(
      JSON.stringify({
        ...parsedFilter,
        [key]: value
      })
    )
  }

  const resetHandler = () => {
    onChangeFilter(JSON.stringify({}))
  }

  const renderFilters = () => {
    return (
      <div className="flex flex-col">
        {filters.map((item) => {
          if (item.type === 'range') {
            return (
              <FilterRange
                filter={item}
                key={item.name}
                value={parsedFilter?.[item.name]}
                onChange={(value) => changeHandler(item.name, value ? value : undefined)}
              />
            )
          }
          if (item.type === 'toggle') {
            return (
              <FilterToggle
                filter={item}
                key={item.name}
                checked={!!parsedFilter?.[item.name]}
                onCheckedChange={(value) => changeHandler(item.name, value ? value : undefined)}
              />
            )
          }
          if (item.type === 'options') {
            if (item.options.length > 0) {
              return (
                <FilterOptions
                  filter={item}
                  key={item.name}
                  selected={parsedFilter?.[item.name]}
                  onSelect={(value) =>
                    changeHandler(item.name, value.length > 0 ? value : undefined)
                  }
                />
              )
            }
          }
          return null
        })}
      </div>
    )
  }

  const renderProtal = () =>
    createPortal(
      <div className={cn('', styles.portal)} ref={portalRef}>
        <div className="flex items-center justify-between bg-neutral-500 relative p-[5px]">
          <button
            type="button"
            className="text-white w-12 h-12 flex items-center justify-center"
            onClick={() => stickyFilterToggle()}
          >
            <XIcon />
          </button>
          <div className="uppercase text-white absolute left-1/2 -translate-x-1/2">Фильтры</div>
          {Object.keys(parsedFilter).length > 0 && (
            <button
              type="button"
              className="flex items-center h-12 text-xs text-neutral-300 px-4"
              onClick={resetHandler}
            >
              Сбросить все
            </button>
          )}
        </div>
        <div className="px-4 pt-4 grow overflow-auto min-lg:pb-4">{renderFilters()}</div>
        <div className="p-4 border-t -mt-px min-lg:hidden">
          <Button
            size="lg"
            variant="sweety"
            className="w-full uppercase"
            onClick={() => stickyFilterToggle()}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner />
                Поиск товаров
              </>
            ) : (
              <>
                Показать {total} {declOfNum(total, ['товар', 'товара', 'товаров'])}
              </>
            )}
          </Button>
        </div>
      </div>,
      document.body
    )

  return (
    <div ref={containerRef}>
      {renderFilters()}
      {stickyFilter && renderProtal()}
    </div>
  )
}
