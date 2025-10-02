import { DeliveryService, PaymentService } from '@/types'

export const labels: {
  DeliveryService: Record<DeliveryService, string>
  PaymentService: Record<PaymentService, string>
} = {
  DeliveryService: {
    [DeliveryService.Pickup]: 'Самовывоз',
    [DeliveryService.Shipping]: 'Доставка'
  },
  PaymentService: {
    [PaymentService.Vtb]: 'Онлайн',
    [PaymentService.UponCash]: 'Наличными',
    [PaymentService.Yookassa]: 'Онлайн'
  }
}

export default labels
