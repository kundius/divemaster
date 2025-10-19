import { CurrentUser } from '@/auth/decorators/current-user.decorator'
import { User } from '@/users/entities/user.entity'
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query
} from '@nestjs/common'
import {
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

  @Post()
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
  update(@Param('id') id: string, @Body() dto: UpdateReviewDto) {
    return this.reviewsService.update(+id, dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(+id)
  }

  @Get(':id/reply')
  findOneReply(@Param('id') id: string) {
    return this.reviewsService.findOneReply(+id)
  }

  @Post(':id/reply')
  createReply(
    @Param('id') id: string,
    @Body() dto: CreateReviewReplyDto,
    @CurrentUser() user?: User
  ) {
    if (!user) {
      throw new ForbiddenException()
    }
    return this.reviewsService.createReply(+id, dto, user)
  }

  @Patch(':id/reply')
  updateReply(
    @Param('id') id: string,
    @Body() dto: UpdateReviewReplyDto,
    @CurrentUser() user?: User
  ) {
    if (!user) {
      throw new ForbiddenException()
    }
    return this.reviewsService.updateReply(+id, dto, user)
  }

  @Delete(':id/reply')
  removeReply(@Param('id') id: string, @CurrentUser() user?: User) {
    if (!user) {
      throw new ForbiddenException()
    }
    return this.reviewsService.removeReply(+id)
  }
}
