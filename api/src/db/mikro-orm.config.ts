import 'dotenv/config'
import { MariaDbDriver } from '@mikro-orm/mariadb'
import { Migrator } from '@mikro-orm/migrations' // or `@mikro-orm/migrations-mongodb`
import { SeedManager } from '@mikro-orm/seeder'

export default {
  extensions: [Migrator, SeedManager],
  // entities: ['./dist/**/entities/*.entity.js'],
  // entitiesTs: ['./src/**/entities/*.entity.ts'],
  driver: MariaDbDriver,
  debug: false,
  autoLoadEntities: true,
  host: process.env['DATABASE_HOST'],
  dbName: process.env['DATABASE_NAME'],
  password: process.env['DATABASE_PASSWORD'],
  user: process.env['DATABASE_USER'],
  migrations: {
    path: './dist/db/migrations',
    pathTs: './src/db/migrations'
  },
  seeder: {
    path: './dist/db/seeders',
    pathTs: './src/db/seeders'
  }
}
