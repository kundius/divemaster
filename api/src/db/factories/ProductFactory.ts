import { slugify } from '@/lib/utils'
import { Product } from '@/products/entities/product.entity'
import { faker } from '@faker-js/faker'
import { Factory } from '@mikro-orm/seeder'

export class ProductFactory extends Factory<Product> {
  model = Product

  definition(): Partial<Product> {
    const title = faker.lorem.sentence()
    const alias = slugify(title)
    // const price = faker.number.int({ min: 1000, max: 1000000 })
    const active = faker.number.float() < 0.9
    return { title, alias, active }
  }
}
