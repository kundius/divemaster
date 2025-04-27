'use client'

import { CheckboxTree } from '@/components/ui/checkbox-tree'
import { Skeleton } from '@/components/ui/skeleton'
import { ApiTableData } from '@/lib/ApiTable/types'
import { apiPatch } from '@/lib/api'
import { arrayToTree, TTree } from '@/lib/utils'
import { CategoryEntity } from '@/types'
import { useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'

export interface PropertyCategoriesProps {
  propertyId: number
}

interface NodeType {
  value: string
  label: string
  children?: NodeType[]
}

export function PropertyCategories({ propertyId }: PropertyCategoriesProps) {
  const [checked, setChecked] = useState<string[]>([])

  const propertyCategoriesQuery = useSWR<CategoryEntity[]>(`properties/${propertyId}/categories`)
  const categoriesQuery = useSWR<ApiTableData<CategoryEntity>>([`categories`, { limit: 100 }])

  const nodes = useMemo(() => {
    const tree = arrayToTree(categoriesQuery.data?.rows || [])
    const fn = (list: TTree<CategoryEntity>[]): NodeType[] => {
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
    setChecked(propertyCategoriesQuery.data?.map((item) => String(item.id)) || [])
  }, [propertyCategoriesQuery.data])

  const checkHandler = async (checked: string[]) => {
    setChecked(checked)
    await apiPatch(`properties/${propertyId}/categories`, { categories: checked })
  }

  return (
    <div className="bg-neutral-50 p-4 rounded-md relative">
      {categoriesQuery.isLoading || propertyCategoriesQuery.isLoading ? (
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
