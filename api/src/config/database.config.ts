import { registerAs } from '@nestjs/config'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'

require('dotenv').config()

export default registerAs<TypeOrmModuleOptions>('database', () => ({
  type: 'mysql',
  host: 'db',
  port: 3306,
  name: 'divemaster',
  username: 'divemaster',
  password: 'divemaster',
  autoLoadEntities: true,
  synchronize: false,
  debug: false
}))
