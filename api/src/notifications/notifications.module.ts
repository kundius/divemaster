import { Module } from '@nestjs/common'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { ScheduleModule } from '@nestjs/schedule'
import { Letter } from './entities/letter.entity'
import { LetterController } from './controllers/letter.controller'
import { LetterService } from './services/letter.service'

@Module({
  imports: [MikroOrmModule.forFeature([Letter]), ScheduleModule.forRoot()],
  controllers: [LetterController],
  providers: [LetterService],
  exports: [LetterService]
})
export class NotificationsModule {}
