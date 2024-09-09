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
import styles from './CitySelect.module.scss'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CitySelectForm, CitySelectFormProps } from './CitySelectForm'
import { useLocationStore } from '@/providers/location-store-provider'
import { useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export function CitySelect() {
  const [showDialog, setShowDialog] = useState(false)

  const locationStore = useLocationStore((state) => state)

  const changeLocationHandler: CitySelectFormProps['onChangeLocation'] = (city) => {
    locationStore.changeCity(city)

    setShowDialog(false)
  }

  if (!locationStore.hasHydrated) {
    return <Skeleton className="w-[120px] h-[16px] rounded bg-neutral-50/50" />
  }

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <button className={styles.button}>
          <span className={styles.affix}>
            <span className={styles.label}>{locationStore.city.name}</span>
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[960px]">
        <DialogHeader>
          <DialogTitle>Ваш город</DialogTitle>
        </DialogHeader>
        <CitySelectForm onChangeLocation={changeLocationHandler} initialCity={locationStore.city} />
      </DialogContent>
    </Dialog>
  )
}
