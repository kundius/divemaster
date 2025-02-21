'use client'

import { useRouter } from 'next/navigation'
import { SpriteIcon } from '@/components/SpriteIcon'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useOrderStore } from '@/providers/order-store-provider'
import { DeliveryService, PickupPointEntity } from '@/types'
import { PointsDetails } from './PointsDetails'
import { PointsItem } from './PointsItem'
import { usePointsQuery } from './PointsQuery'
import { useLocationStore } from '@/providers/location-store-provider'
import { CitySelectForm, CitySelectFormProps } from '@/components/site/Header/CitySelectForm'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { MapPinIcon } from '@heroicons/react/24/outline'

export function PointsList() {
  const orderState = useOrderStore((state) => state)
  const router = useRouter()
  const { loading, rows, coverage, selected, mapRef, setSelected } = usePointsQuery()

  const locationStore = useLocationStore((state) => state)
  const [showCitySelect, setShowCitySelect] = useState(false)
  const changeLocationHandler: CitySelectFormProps['onChangeLocation'] = (city) => {
    locationStore.changeCity(city)
    setShowCitySelect(false)
  }

  const openEntity = async (entity: PickupPointEntity) => {
    if (mapRef.current) {
      await mapRef.current.setCenter([entity.lat, entity.lon], 18)
    }
    setSelected(entity)
  }

  const selectEntity = async (entity: PickupPointEntity) => {
    orderState.setDelivery({
      service: DeliveryService.Pickup,
      address: entity.fullAddress,
      properties: {
        pickupPointId: entity.id
      }
    })
    router.push('/order')
  }

  // const renderContent = () => {
  //   if (loading) {
  //     return (
  //       <div className="flex flex-col gap-6">
  //         {[0, 1, 2].map((n) => (
  //           <div key={n}>
  //             <div className="flex gap-4">
  //               <Skeleton className="rounded-full w-8 h-8" />
  //               <Skeleton className="flex-grow h-8" />
  //             </div>
  //             <div className="flex flex-col gap-1.5 mt-3">
  //               <Skeleton className="w-full h-4" />
  //               <Skeleton className="w-full h-4" />
  //             </div>
  //           </div>
  //         ))}
  //       </div>
  //     )
  //   }

  //   if (selected) {
  //     return (
  //       <div className="min-h-full flex flex-col">
  //         <div className="pt-4">
  //           <PointsDetails entity={selected} />
  //         </div>
  //         <div className="flex-grow" />
  //         <div className="mt-6">
  //           <Button
  //             onClick={() => {
  //               orderState.setDelivery({
  //                 service: DeliveryService.Pickup,
  //                 address: selected.fullAddress,
  //                 properties: {
  //                   pickupPointId: selected.id
  //                 }
  //               })
  //               router.push('/order')
  //             }}
  //             variant="default"
  //             size="lg"
  //             className="w-full uppercase font-sans-narrow"
  //           >
  //             Заберу отсюда
  //           </Button>
  //         </div>
  //       </div>
  //     )
  //   }

  //   return (
  //     <div>
  //       {coverage === 'subject' && (
  //         <Alert variant="default" className="mb-4">
  //           <SpriteIcon name="exclamation-circle" size={14} />
  //           <AlertTitle>Внимание!</AlertTitle>
  //           <AlertDescription>
  //             К сожалению, рядом с вами пока нет пунктов выдачи заказов. Показаны пункты выдачи
  //             вашего региона.
  //           </AlertDescription>
  //         </Alert>
  //       )}
  //       <div className="flex flex-col">
  //         {rows.map((item) => (
  //           <PointsItem key={item.id} entity={item} />
  //         ))}
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <>
      {!locationStore.hasHydrated ? (
        <Skeleton className="w-full h-[16px] rounded bg-neutral-50/50" />
      ) : (
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='text-base text-neutral-500'>Ваш город:</div>
            <Dialog open={showCitySelect} onOpenChange={setShowCitySelect}>
              <DialogTrigger asChild>
                <button className='group font-sans-narrow inline-flex gap-1 items-center text-primary uppercase font-bold text-sm tracking-wide'>
                  <MapPinIcon className='w-4 h-4' />
                  <span className='border-b border-t border-transparent group-hover:border-b-primary'>
                    {locationStore.city.name}
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
        </div>
      )}
      <div className="flex-grow overflow-auto mt-4">
        {loading && (
          <div className="flex flex-col gap-6">
            {[0, 1, 2].map((n) => (
              <div key={n}>
                <div className="flex gap-4">
                  <Skeleton className="rounded-full w-8 h-8" />
                  <Skeleton className="flex-grow h-8" />
                </div>
                <div className="flex flex-col gap-1.5 mt-3">
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-full h-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {coverage === 'subject' && (
          <Alert variant="default" className="mb-4">
            <SpriteIcon name="exclamation-circle" size={14} />
            <AlertTitle>Внимание!</AlertTitle>
            <AlertDescription>
              К сожалению, рядом с вами пока нет пунктов выдачи заказов. Показаны пункты выдачи
              вашего региона.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col">
          {rows.map((item) => (
            <PointsItem
              key={item.id}
              entity={item}
              onSelect={() => selectEntity(item)}
              onOpen={() => openEntity(item)}
              open={selected?.id === item.id}
            />
          ))}
        </div>
      </div>
    </>
  )
}
