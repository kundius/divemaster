import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Option } from '../entities/option.entity'
import { Category } from '../entities/category.entity'

@Injectable()
export class SyncService {
  constructor(
    @InjectRepository(Option)
    private optionRepository: Repository<Option>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>
  ) {}
}
