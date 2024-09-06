'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import css from './CitySelectForm.module.scss'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useEffect } from 'react'
import useSWR from 'swr'

export function CitySelectForm() {
  const query = useSWR<{
    districts: {
      name: string
      id: number
    }[]
    regions: {
      name: string
      fullname: string
      id: number
      districtId: number
    }[]
    cities: {
      name: string
      id: string
      regionId: number
    }[]
  }>(['pickup-point/cities', {}])
  console.log(query.data)
  useEffect(() => {
    console.log('useEffect CitySelectForm')
  })
  if (query.isLoading) {
    return <div>Loading...</div>
  }
  return (
    <div className="">
      <input className={css.search} placeholder="Найти город" />
      <div className="flex gap-2 mt-8">
        <div className="w-1/3">
          <div className="px-4 font-medium text-lg">Округ</div>
          <div className="flex flex-col gap-2 items-start h-96 overflow-auto mt-4">
            {query.data?.districts.map((item) => (
              <Button variant="ghost" key={item.id} className="w-full justify-start">
                {item.name}
              </Button>
            ))}
          </div>
        </div>
        <div className="w-px bg-neutral-100" />
        <div className="w-1/3">
          <div className="px-4 font-medium text-lg">Регион</div>
        </div>
        <div className="w-px bg-neutral-100" />
        <div className="w-1/3">
          <div className="px-4 font-medium text-lg">Город</div>
        </div>
      </div>
    </div>
  )
}
