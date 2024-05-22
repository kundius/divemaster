import { DataSource } from 'typeorm'
import { Seeder, SeederFactoryManager } from 'typeorm-extension'

export class ProductsSeeder implements Seeder {
  track = false

  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {}
}
