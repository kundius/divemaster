import { Module } from '@nestjs/common'
import { TypesenseService } from './typesense.service'

@Module({
  providers: [TypesenseService],
  exports: [TypesenseService]
})
export class TypesenseModule {}
