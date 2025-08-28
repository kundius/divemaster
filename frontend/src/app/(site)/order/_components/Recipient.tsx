'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useOrderStore } from '@/providers/order-store-provider'

import { Errors } from './Errors'
import css from './Recipient.module.css'

export function Recipient() {
  const orderState = useOrderStore((state) => state)

  if (!orderState.delivery) {
    return (
      <div>
        <div className={css.title}>Данные получателя</div>
        <div className={css.description}>
          Выберите способ получения и вы сможете ввести контактные данные
        </div>
        <div className="empty:hidden mt-6">
          <Errors field="recipient" />
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className={css.title}>Данные получателя</div>
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div className="space-y-1">
          <Label htmlFor="recipientName">
            Имя и фамилия <span className="text-red-500">*</span>
          </Label>
          <Input
            name="recipientName"
            id="recipientName"
            value={orderState.recipient?.name || ''}
            onChange={(e) =>
              orderState.setRecipient({
                name: e.target.value,
                email: orderState.recipient?.email || '',
                phone: orderState.recipient?.phone || ''
              })
            }
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="recipientEmail">
            E-mail <span className="text-red-500">*</span>
          </Label>
          <Input
            name="recipientEmail"
            id="recipientEmail"
            value={orderState.recipient?.email || ''}
            onChange={(e) =>
              orderState.setRecipient({
                name: orderState.recipient?.name || '',
                email: e.target.value,
                phone: orderState.recipient?.phone || ''
              })
            }
          />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div className="space-y-1">
          <Label htmlFor="recipientPhone">
            Телефон <span className="text-red-500">*</span>
          </Label>
          <Input
            name="recipientPhone"
            id="recipientPhone"
            value={orderState.recipient?.phone || ''}
            onChange={(e) =>
              orderState.setRecipient({
                name: orderState.recipient?.name || '',
                email: orderState.recipient?.email || '',
                phone: e.target.value
              })
            }
          />
        </div>
      </div>
      <div className="empty:hidden mt-6">
        <Errors field="recipient" />
      </div>
    </div>
  )
}
