import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Brackets, FindOptionsRelations, FindOptionsWhere, Like, Repository } from 'typeorm'
import { Review } from '../entities/review.entity'
import { ReviewMedia } from '../entities/review-media.entity'
import { ReviewReply } from '../entities/review-reply.entity'
import { CreateReviewDto, FindAllReviewQueryDto, UpdateReviewDto } from '../dto/review.dto'

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(ReviewMedia)
    private reviewMediaRepository: Repository<ReviewMedia>,
    @InjectRepository(ReviewReply)
    private reviewReplyRepository: Repository<ReviewReply>
  ) {}

  async findOne(id: number) {
    return this.reviewRepository.findOne({
      where: { id },
      relations: { user: true }
    })
  }

  async findAll(dto: FindAllReviewQueryDto) {
    const qb = this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')

    if (dto.productId) {
      qb.andWhere('review.productId = :productId', { productId: dto.productId })
    }

    if (dto.query) {
      qb.andWhere(
        new Brackets((_qb) => {
          _qb.where('review.advantages LIKE :query1', {
            query1: `%${dto.query}%`
          })
          _qb.orWhere('review.flaws LIKE :query2', { query2: `%${dto.query}%` })
          _qb.orWhere('review.comment LIKE :query3', { query3: `%${dto.query}%` })
        })
      )
    }

    qb.orderBy(`review.${dto.sort}`, dto.dir)
    qb.skip(dto.skip).take(dto.take)

    const [rows, total] = await qb.getManyAndCount()

    return { rows, total }
  }

  async create({ productId, userId, ...fillable }: CreateReviewDto) {
    const record = new Review()

    this.reviewRepository.merge(record, fillable)

    if (typeof productId !== 'undefined') {
      record.productId = productId
    }

    if (typeof userId !== 'undefined') {
      record.userId = userId
    }

    await this.reviewRepository.save(record)

    return record
  }

  async update(id: number, { productId, userId, ...fillable }: UpdateReviewDto) {
    const record = await this.reviewRepository.findOneOrFail({
      where: { id }
    })

    this.reviewRepository.merge(record, fillable)

    if (typeof productId !== 'undefined') {
      record.productId = productId
    }

    if (typeof userId !== 'undefined') {
      record.userId = userId
    }

    await this.reviewRepository.save(record)

    return record
  }

  async remove(id: number) {
    await this.reviewRepository.delete({ id })
  }
}
