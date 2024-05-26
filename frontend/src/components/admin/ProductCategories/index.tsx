'use client'

import useSWR from 'swr'
import { VespTableData } from '@/components/vesp/VespTable/types'
import { apiGet, apiPatch } from '@/lib/api'
import { withToken } from '@/lib/api/with-token'
import { useAuth } from '@/lib/auth/use-auth'
import { Category } from '@/types'
import {
  ArrowPathIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  DocumentIcon,
  FolderIcon,
  FolderOpenIcon,
  MinusIcon,
  PlusCircleIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { CheckboxTree } from '@/components/ui/checkbox-tree'
import { useApi } from '@/lib/napi/use-api'

export interface ProductCategoriesProps {
  productId: number
}

interface NodeType {
  value: string
  label: string
  children?: NodeType[]
}

export function ProductCategories({ productId }: ProductCategoriesProps) {
  console.log('render ProductCategories')

  const api = useApi()

  // const auth = useAuth()

  const [saving, setSaving] = useState(false)
  const [checked, setChecked] = useState<string[]>([])
  const [expanded, setExpanded] = useState<string[]>([])

  const productCategoriesQuery = useSWR<Category[]>(
    `products/${productId}/categories`,
    (url: string) => api.get<Category[]>(url, {})
  )
  const categoriesQuery = useSWR<Category[]>(
    `categories/tree`,
    (url: string) => api.get<Category[]>(url, {})
  )

  const nodes = useMemo(() => {
    const fn = (list: Category[]): NodeType[] => {
      return list.map((item) => {
        const children = fn(item.children)
        return {
          label: item.title,
          value: String(item.id),
          children: children.length > 0 ? children : undefined
        }
      })
    }
    return fn(categoriesQuery.data || [])
  }, [categoriesQuery.data])

  // const nodes = useMemo(() => {
  //   const list = categoriesQuery.data?.rows || []
  //   const fn = (parentId: number | null): NodeType[] => {
  //     return list
  //       .filter((item) => item.parent === parentId)
  //       .map((item) => {
  //         const children = fn(item.id)
  //         return {
  //           label: item.title,
  //           value: String(item.id),
  //           children: children.length > 0 ? children : undefined
  //         }
  //       })
  //   }
  //   return fn(null)
  // }, [categoriesQuery.data?.rows])

  useEffect(() => {
    setChecked(productCategoriesQuery.data?.map((item) => String(item.id)) || [])
    setExpanded(productCategoriesQuery.data?.map((item) => String(item.parent)) || [])
  }, [productCategoriesQuery.data])

  const onSubmit = async () => {
    setSaving(true)
    await api.patch(
      `products/${productId}/categories`,
      { categories: checked }
    )
    setSaving(false)
  }

  return (
    <div>
      <div className="justify-end flex items-center mb-4">
        <Button onClick={onSubmit} loading={saving}>
          Сохранить
        </Button>
      </div>

      <div className="p-4 bg-neutral-50/95 rounded-md">
        {categoriesQuery.isLoading || productCategoriesQuery.isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-60" />
            <Skeleton className="h-4 w-32 ml-8" />
            <Skeleton className="h-4 w-48 ml-8" />
            <Skeleton className="h-4 w-40 ml-8" />
            <Skeleton className="h-4 w-60" />
            <Skeleton className="h-4 w-32 ml-8" />
            <Skeleton className="h-4 w-48 ml-8" />
            <Skeleton className="h-4 w-40 ml-8" />
          </div>
        ) : (
          <CheckboxTree
            nodes={nodes}
            checked={checked}
            expanded={expanded}
            onCheck={(checked) => setChecked(checked)}
            onExpand={(expanded) => setExpanded(expanded)}
            noCascade
          />
        )}
      </div>
    </div>
  )
}
