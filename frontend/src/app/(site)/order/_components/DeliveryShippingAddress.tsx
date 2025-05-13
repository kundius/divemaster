import { useMemo } from 'react'
import { SelectedAddress } from './SelectedAddress'

export interface DeliveryShippingAddressProps {
  properties: Record<string, unknown>
}

export function DeliveryShippingAddress({ properties }: DeliveryShippingAddressProps) {
  const address = useMemo(() => {
    const tmp = []
    if (properties.city) tmp.push(properties.city)
    if (properties.street) tmp.push(properties.street)
    if (properties.house) tmp.push(properties.house)
    if (properties.apartment) tmp.push(`кв/офис ${properties.apartment}`)
    if (properties.entrance) tmp.push(`подъезд ${properties.entrance}`)
    if (properties.floor) tmp.push(`этаж ${properties.floor}`)
    if (properties.intercom) tmp.push(`домофон ${properties.intercom}`)
    return tmp.join(', ')
  }, [properties])

  return <SelectedAddress title="Доставим курьером" description={address} />
}
