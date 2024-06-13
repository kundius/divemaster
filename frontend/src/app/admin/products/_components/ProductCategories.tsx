'use client'

import { CheckboxTree } from '@/components/ui/checkbox-tree'
import { Skeleton } from '@/components/ui/skeleton'
import { ApiTableData } from '@/lib/ApiTable/types'
import { apiPatch } from '@/lib/api'
import { withClientAuth } from '@/lib/api/with-client-auth'
import { CategoryEntity } from '@/types'
import { useEffect, useMemo, useState } from 'react'
import { OnCheckNode } from 'react-checkbox-tree'
import useSWR from 'swr'

export interface ProductCategoriesProps {
  productId: number
}

interface NodeType {
  value: string
  label: string
  children?: NodeType[]
}

export function ProductCategories({ productId }: ProductCategoriesProps) {
  const [checked, setChecked] = useState<string[]>([])
  const [expanded, setExpanded] = useState<string[]>([])

  const productCategoriesQuery = useSWR<CategoryEntity[]>(`products/${productId}/categories`)
  // TODO: HIERARCHY_DEPTH_LIMIT
  // в populate указана необходимоя вложенность подкатегорий
  const categoriesQuery = useSWR<ApiTableData<CategoryEntity>>([
    `categories`,
    {
      parent: 0,
      all: 1,
      populate: ['children', 'children.children']
    }
  ])

  const nodes = useMemo(() => {
    const fn = (list: CategoryEntity[]): NodeType[] => {
      return list.map((item) => {
        const children = fn(item.children || [])
        return {
          label: item.title,
          value: String(item.id),
          children: children.length > 0 ? children : undefined
        }
      })
    }
    return fn(categoriesQuery.data?.rows || [])
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

  const checkTree = (value: string) => {
    const rows = categoriesQuery.data?.rows || []

    function findTreeIds(data: CategoryEntity[], id: number): string[] {
      const res: string[] = []
      const forFn = function (arr: CategoryEntity[], key: number) {
        for (let i = 0; i < arr.length; i += 1) {
          const item = arr[i]
          if (item.id === key) {
            res.push(String(item.id))
            if (item.parent) {
              forFn(data, typeof item.parent === 'number' ? item.parent : item.parent.id)
            }
            break
          } else if (item.children) {
            forFn(item.children, key)
          }
        }
      }
      forFn(data, id)
      return res
    }

    return findTreeIds(rows, Number(value))
  }

  const checkHandler = async (checked: string[], targetNode: OnCheckNode) => {
    let next = checked
    if (targetNode.checked) {
      next = [...next, ...checkTree(targetNode.value)]
    }
    setChecked(next)
    await apiPatch(`products/${productId}/categories`, { categories: next }, withClientAuth())
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
        <CheckboxTree
          nodes={nodes}
          checked={checked}
          expanded={expanded}
          onCheck={checkHandler}
          onExpand={setExpanded}
          noCascade
        />
      )}
    </div>
  )
}
