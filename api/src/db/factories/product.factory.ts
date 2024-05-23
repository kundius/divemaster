import { slugify } from '@/lib/utils'
import { Product } from '@/products/entities/product.entity'
import { setSeederFactory } from 'typeorm-extension'

export default setSeederFactory(Product, (faker) => {
  const product = new Product()

  product.title = faker.lorem.sentence()
  product.alias = slugify(product.title)
  product.price = faker.number.int({ min: 1000, max: 1000000 })
  product.active = faker.number.float() < 0.9

  return product
})
