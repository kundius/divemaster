import { EntityRepository } from '@mikro-orm/mariadb'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { File } from '../entities/file.entity'

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private filesRepository: EntityRepository<File>
  ) {}

  async findOne(id: number) {
    return await this.filesRepository.findOneOrFail({ id })
  }
}
