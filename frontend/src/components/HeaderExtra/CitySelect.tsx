'use client'

import { useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { useLocationStore } from '@/providers/location-store-provider'

import styles from './CitySelect.module.css'
import { CitySelectForm, CitySelectFormProps } from './CitySelectForm'

export function CitySelect() {
  const [showDialog, setShowDialog] = useState(false)

  const locationStore = useLocationStore((state) => state)

  const changeLocationHandler: CitySelectFormProps['onChangeLocation'] = (city) => {
    locationStore.changeCity(city)

    setShowDialog(false)
  }

  if (!locationStore.hasHydrated) {
    return (
      <div className={styles.box}>
        <Skeleton className="w-[120px] h-[16px] rounded bg-neutral-50/50" />
      </div>
    )
  }

  return (
    <div className={styles.box}>
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
          <CitySelectForm
            onChangeLocation={changeLocationHandler}
            initialCity={locationStore.city}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
