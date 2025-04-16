import { EventSubscriber, EntitySubscriberInterface, LoadEvent } from 'typeorm'
import { Order } from '../entities/order.entity'

@EventSubscriber()
export class OrderSubscriber implements EntitySubscriberInterface<Order> {
  listenTo() {
    return Order
  }

  afterLoad(entity: Order) {
    const arr: string[] = []
    if (entity.hash) {
      arr.push(entity.hash.split('-')[1])
    }
    arr.push(entity.id.toString().padStart(4, '0'))
    entity.number = arr.join('-')
  }
}
