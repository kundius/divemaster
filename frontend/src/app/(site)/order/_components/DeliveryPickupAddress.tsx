import { Skeleton } from '@/components/ui/skeleton'
import { PickupPointEntity, PickupPointTypeEnum } from '@/types'
import useSWR from 'swr'
import { SelectedAddress } from './SelectedAddress'

export interface DeliveryPickupAddressProps {
  properties: Record<string, unknown>
}

export function DeliveryPickupAddress({ properties }: DeliveryPickupAddressProps) {
  const { data, isLoading } = useSWR<PickupPointEntity>([
    `pickup-point/${properties.pickupPointId}`,
    {}
  ])

  const renderTitle = () => {
    if (isLoading) return <Skeleton className="w-24 h-[18px]" />
    if (!data) {
      throw new Error('Пункт выдачи не найден')
    }
    switch (data.type) {
      case PickupPointTypeEnum.cdek:
        return 'Забрать из пункта выдачи'
      case PickupPointTypeEnum.store:
        return 'Забрать из магазина'
      default:
        throw new Error('Неизвестный тип пункта выдачи')
    }
  }

  const renderDesc = () => {
    if (isLoading) return <Skeleton className="w-48 h-[18px]" />
    if (!data) {
      throw new Error('Пункт выдачи не найден')
    }
    return data.fullAddress
  }

  return <SelectedAddress title={renderTitle()} description={renderDesc()} />
}
