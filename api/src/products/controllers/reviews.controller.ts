import { CurrentUser } from '@/auth/decorators/current-user.decorator'
import { HasScope } from '@/auth/decorators/has-scope.decorator'
import { User } from '@/users/entities/user.entity'
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query
} from '@nestjs/common'
import {
  AddReviewDto,
  CreateReviewDto,
  CreateReviewReplyDto,
  FindAllReviewQueryDto,
  UpdateReviewDto,
  UpdateReviewReplyDto
} from '../dto/review.dto'
import { ReviewService } from '../services/review.service'

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewService) {}

  @Post('add')
  add(@Body() dto: AddReviewDto, @CurrentUser() user?: User) {
    const isPublished = !!user
    const publishedAt = isPublished ? new Date() : undefined
    const userId = user?.id

    return this.reviewsService.create({
      ...dto,
      isPublished,
      publishedAt,
      userId
    })
  }

  @Post()
  @HasScope('admin')
  create(@Body() dto: CreateReviewDto) {
    return this.reviewsService.create(dto)
  }

  @Get()
  findAll(@Query() query: FindAllReviewQueryDto) {
    return this.reviewsService.findAll(query)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const record = await this.reviewsService.findOne(+id)
    if (!record) {
      throw new NotFoundException()
    }
    return record
  }

  @Patch(':id')
  @HasScope('admin')
  update(@Param('id') id: string, @Body() dto: UpdateReviewDto) {
    return this.reviewsService.update(+id, dto)
  }

  @Delete(':id')
  @HasScope('admin')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(+id)
  }

  @Get(':id/reply')
  findOneReply(@Param('id') id: string) {
    return this.reviewsService.findOneReply(+id)
  }

  @Post(':id/reply')
  @HasScope('admin')
  createReply(
    @Param('id') id: string,
    @Body() dto: CreateReviewReplyDto,
    @CurrentUser() user: User
  ) {
    return this.reviewsService.createReply(+id, {
      ...dto,
      userId: dto.userId ?? user.id
    })
  }

  @Patch(':id/reply')
  @HasScope('admin')
  updateReply(
    @Param('id') id: string,
    @Body() dto: UpdateReviewReplyDto,
    @CurrentUser() user: User
  ) {
    return this.reviewsService.updateReply(+id, {
      ...dto,
      userId: dto.userId ?? user.id
    })
  }

  @Delete(':id/reply')
  @HasScope('admin')
  removeReply(@Param('id') id: string) {
    return this.reviewsService.removeReply(+id)
  }
}
