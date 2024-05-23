import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { json, urlencoded } from 'express'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({
    origin: process.env['APP_ORIGIN']
  })
  app.use(json({ limit: '100mb' }))
  app.use(urlencoded({ extended: true, limit: '100mb' }))
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  await app.listen(process.env['APP_PORT'] || 4000)
}
bootstrap()
