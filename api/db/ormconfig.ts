import { DataSource } from 'typeorm'

require('dotenv').config()

export const AppDataSource = new DataSource({
  type: 'mysql',

  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: parseInt(process.env.DATABASE_PORT || '3306'),

  entities: ['dist/**/*.entity.js'],
  logging: false,
  synchronize: false,
  migrationsRun: false,
  migrations: ['dist/**/migrations/*.js'],
  subscribers: ['dist/**/*.subscriber.js']
})
