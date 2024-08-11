import type { EntityManager } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
// import { ProductsSeeder } from './ProductsSeeder'
import { UsersSeeder } from './UsersSeeder'

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    return this.call(em, [UsersSeeder])
  }
}
