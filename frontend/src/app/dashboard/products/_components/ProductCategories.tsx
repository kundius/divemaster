'use client'

import { CheckboxTree, CheckboxTreeNode } from '@/components/ui/checkbox-tree'
import { Skeleton } from '@/components/ui/skeleton'
import { ApiTableData } from '@/lib/ApiTable/types'
import { apiPatch } from '@/lib/api'
import { arrayToTree, TTree } from '@/lib/utils'
import { CategoryEntity } from '@/types'
import { useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'

export interface ProductCategoriesProps {
  productId: number
}

export function ProductCategories({ productId }: ProductCategoriesProps) {
  const [checked, setChecked] = useState<string[]>([])

  const productCategoriesQuery = useSWR<CategoryEntity[]>(`products/${productId}/categories`)
  const categoriesQuery = useSWR<ApiTableData<CategoryEntity>>([`categories`, { limit: 100 }])

  const nodes = useMemo(() => {
    const tree = arrayToTree(categoriesQuery.data?.rows || [])
    const fn = (list: TTree<CategoryEntity>[]): CheckboxTreeNode[] => {
      return list.map((item) => {
        const children = fn(item.children || [])
        return {
          label: item.title,
          value: String(item.id),
          children: children.length > 0 ? children : undefined
        }
      })
    }
    return fn(tree)
  }, [categoriesQuery.data])

  useEffect(() => {
    setChecked(productCategoriesQuery.data?.map((item) => String(item.id)) || [])
  }, [productCategoriesQuery.data])

  const checkHandler = async (_checked: string[]) => {
    setChecked(_checked)
    await apiPatch(`products/${productId}/categories`, { categories: _checked })
  }

  return (
    <div className="bg-neutral-50 p-4 rounded-md">
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
        <CheckboxTree items={nodes} checked={checked} onCheck={checkHandler} />
      )}
    </div>
  )
}
