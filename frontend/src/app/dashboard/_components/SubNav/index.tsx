'use client'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback } from 'react'

export interface SubNavProps {
  items?: {
    title: string
    url: string
    disabled?: boolean
  }[]
}

export function SubNav({ items = [] }: SubNavProps) {
  const router = useRouter()
  const pathname = usePathname()

  const valueChangeHandler = useCallback((url: string) => router.push(url), [items])

  return (
    <div>
      <div className="lg:hidden">
        <Select defaultValue={pathname} onValueChange={valueChangeHandler}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {items.map((item) => (
                <SelectItem
                  key={`${item.title}:${item.url}`}
                  value={item.url}
                  disabled={item.disabled}
                >
                  {item.title}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Tabs defaultValue={pathname} onValueChange={valueChangeHandler} className="max-lg:hidden">
        <TabsList>
          {items.map((item) => (
            <TabsTrigger
              key={`${item.title}:${item.url}`}
              value={item.url}
              disabled={item.disabled}
            >
              {item.title}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}
