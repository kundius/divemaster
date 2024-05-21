import 'dotenv/config'
import { DataSource, DataSourceOptions } from 'typeorm'
import { SeederOptions } from 'typeorm-extension'

export const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'mysql',
  host: process.env['DATABASE_HOST'],
  port: Number(process.env['DATABASE_PORT']),
  username: process.env['DATABASE_USER'],
  password: process.env['DATABASE_PASSWORD'],
  database: process.env['DATABASE_NAME'],
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/db/migrations/*{.ts,.js}'],
  seeds: ['dist/db/seeds/**/*.js'],
  synchronize: false,
  migrationsTableName: 'migrations'
}

const dataSource = new DataSource(dataSourceOptions)

export default dataSource
