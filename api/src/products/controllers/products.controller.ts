import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import {
  CreateProductDto,
  FindAllProductDto,
  FindOneProductDto,
  SortProductImageDto,
  UpdateProductCategoryDto,
  UpdateProductDto,
  UpdateProductImageDto,
  UpdateProductOptions
} from '../dto/products.dto'
import { ProductsService } from '../services/products.service'

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto)
  }

  @Get()
  findAll(@Query() query: FindAllProductDto) {
    return this.productsService.findAll(query)
  }

  @Get('alias::alias')
  async findOneByAlias(@Param('alias') alias: string, @Query() dto: FindOneProductDto) {
    const product = await this.productsService.findOneByAlias(alias, dto)
    if (!product) {
      throw new NotFoundException()
    }
    return product
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query() dto: FindOneProductDto) {
    return this.productsService.findOne(+id, dto)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(+id, dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id)
  }

  @Get(':productId/options')
  findAllOption(@Param('productId') productId: string) {
    return this.productsService.findAllOptions(+productId)
  }

  @Patch(':productId/options')
  updateOptions(@Param('productId') productId: string, @Body() dto: UpdateProductOptions) {
    return this.productsService.updateOptions(+productId, dto)
  }

  @Get(':productId/categories')
  findAllCategory(@Param('productId') productId: string) {
    return this.productsService.findAllCategory(+productId)
  }

  @Patch(':productId/categories')
  updateCategory(@Param('productId') productId: string, @Body() dto: UpdateProductCategoryDto) {
    return this.productsService.updateCategory(+productId, dto)
  }

  @Get(':productId/images')
  findAllProductImage(@Param('productId') productId: string) {
    return this.productsService.findAllProductImage(+productId)
  }

  @Post(':productId/images')
  @UseInterceptors(FileInterceptor('file', { storage: diskStorage({}) }))
  async createProductImage(
    @Param('productId') productId: string,
    @UploadedFile() upload: Express.Multer.File
  ) {
    return this.productsService.createProductImage(+productId, upload)
  }

  @Put(':productId/images')
  async sortProductImage(@Param('productId') productId: string, @Body() dto: SortProductImageDto) {
    return this.productsService.sortProductImage(+productId, dto)
  }

  @Patch(':productId/images/:fileId')
  async updateProductImage(
    @Param('productId') productId: string,
    @Param('fileId') fileId: string,
    @Body() dto: UpdateProductImageDto
  ) {
    return this.productsService.updateProductImage(+productId, +fileId, dto)
  }

  @Delete(':productId/images/:fileId')
  async removeProductImage(@Param('productId') productId: string, @Param('fileId') fileId: string) {
    return this.productsService.removeProductImage(+productId, +fileId)
  }

  @Get(':productId/offers')
  findAllOffers(@Param('productId') productId: string) {
    return this.productsService.findAllOffers(+productId)
  }
}
