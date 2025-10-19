import { User } from '@/users/entities/user.entity'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Brackets, In, Repository } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import {
  CreateReviewDto,
  CreateReviewReplyDto,
  FindAllReviewQueryDto,
  UpdateReviewDto,
  UpdateReviewReplyDto
} from '../dto/review.dto'
import { ReviewMedia } from '../entities/review-media.entity'
import { ReviewReply } from '../entities/review-reply.entity'
import { Review } from '../entities/review.entity'

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

  mediaFromIds(reviewId: number, fileIds: number[]) {
    const media: ReviewMedia[] = []
    let rank = 0
    for (const fileId of fileIds) {
      rank++
      media.push(
        this.reviewMediaRepository.create({
          fileId,
          reviewId,
          rank
        })
      )
    }
    return media
  }

  async findOne(id: number) {
    return this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .leftJoinAndSelect('review.reply', 'reply')
      .leftJoinAndSelect('reply.user', 'replyUser')
      .leftJoinAndSelect('review.media', 'media')
      .where('review.id = :id', { id })
      .orderBy('media.rank', 'ASC')
      .getOne()
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

  async create({ productId, userId, mediaIds, ...fillable }: CreateReviewDto) {
    let record = this.reviewRepository.create(fillable)

    if (typeof productId !== 'undefined') {
      record.productId = productId
    }

    if (typeof userId !== 'undefined') {
      record.userId = userId
    }

    record = await this.reviewRepository.save(record)

    if (typeof mediaIds !== 'undefined') {
      record.media = this.mediaFromIds(record.id, mediaIds)
    }

    record = await this.reviewRepository.save(record)

    return this.findOne(record.id)
  }

  async update(id: number, { productId, userId, mediaIds, ...fillable }: UpdateReviewDto) {
    const record = await this.reviewRepository.findOneOrFail({
      where: { id },
      relations: { media: true }
    })

    this.reviewRepository.merge(record, fillable)

    if (typeof productId !== 'undefined') {
      record.productId = productId
    }

    if (typeof userId !== 'undefined') {
      record.userId = userId
    }

    if (typeof mediaIds !== 'undefined') {
      // удаляем старые медиа и привязываем новые
      await this.reviewMediaRepository.remove(record.media)
      record.media = this.mediaFromIds(record.id, mediaIds)
    }

    await this.reviewRepository.save(record)

    return this.findOne(record.id)
  }

  async remove(id: number) {
    await this.reviewRepository.delete({ id })
  }

  async findOneReply(reviewId: number) {
    return this.reviewReplyRepository.findOneOrFail({
      where: { review: { id: reviewId } },
      relations: { user: true }
    })
  }

  async createReply(reviewId: number, dto: CreateReviewReplyDto, user: User) {
    const existing = await this.reviewReplyRepository.exists({
      where: { review: { id: reviewId } }
    })

    if (existing) {
      throw new BadRequestException('Ответ уже существует')
    }

    const record = this.reviewReplyRepository.create({
      comment: dto.comment,
      publishedAt: dto.publishedAt ?? new Date(),
      userId: dto.userId ?? user.id,
      reviewId
    })

    await this.reviewReplyRepository.save(record)

    return this.findOneReply(reviewId)
  }

  async updateReply(reviewId: number, dto: UpdateReviewReplyDto, user: User) {
    const partialEntity: QueryDeepPartialEntity<ReviewReply> = {}

    if (typeof dto.comment !== 'undefined') {
      partialEntity.comment = dto.comment
    }

    if (typeof dto.publishedAt !== 'undefined') {
      partialEntity.publishedAt = dto.publishedAt === null ? new Date() : dto.publishedAt
    }

    if (typeof dto.userId !== 'undefined') {
      partialEntity.userId = dto.userId === null ? user.id : dto.userId
    }

    const result = await this.reviewReplyRepository.update(
      { review: { id: reviewId } },
      partialEntity
    )

    if (result.affected === 0) {
      throw new NotFoundException('Ответ не найден')
    }

    return this.findOneReply(reviewId)
  }

  async removeReply(reviewId: number) {
    const result = await this.reviewReplyRepository.delete({ review: { id: reviewId } })

    if (result.affected === 0) {
      throw new NotFoundException('Ответ не найден')
    }
  }
}
