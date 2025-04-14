import { EventSubscriber, EntitySubscriberInterface, LoadEvent } from 'typeorm'
import { Order } from '../entities/order.entity'

@EventSubscriber()
export class OrderSubscriber implements EntitySubscriberInterface<Order> {
  listenTo() {
    return Order
  }

  afterLoad(entity: Order) {
    entity.number = `${entity.hash.split('-')[1]}-${entity.id.toString().padStart(4, '0')}`
  }
}
