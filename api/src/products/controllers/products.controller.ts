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
import { CreateProductContentDto } from '../dto/create-product-content.dto'
import { CreateProductDto } from '../dto/create-product.dto'
import { FindAllProductQueryDto } from '../dto/find-all-product-query.dto'
import { FindOneProductQueryDto } from '../dto/find-one-product-query.dto'
import { SortProductContentDto } from '../dto/sort-product-content.dto'
import { SortProductImageDto } from '../dto/sort-product-image.dto'
import { UpdateProductCategoryDto } from '../dto/update-product-category.dto'
import { UpdateProductContentDto } from '../dto/update-product-content.dto'
import { UpdateProductImageDto } from '../dto/update-product-image.dto'
import { UpdateProductDto } from '../dto/update-product.dto'
import { ProductsService } from '../services/products.service'

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto)
  }

  @Get()
  findAll(@Query() query: FindAllProductQueryDto) {
    return this.productsService.findAll(query)
  }

  @Get('alias::alias')
  async findOneByAlias(@Param('alias') alias: string, @Query() query: FindOneProductQueryDto) {
    const product = await this.productsService.findOneByAlias(alias, query)
    if (!product) {
      throw new NotFoundException()
    }
    return product
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query() query: FindOneProductQueryDto) {
    return this.productsService.findOne(+id, query)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id)
  }

  @Get(':productId/categories')
  findAllProductCategory(@Param('productId') productId: string) {
    return this.productsService.findAllProductCategory(+productId)
  }

  @Patch(':productId/categories')
  updateProductCategory(
    @Param('productId') productId: string,
    @Body() dto: UpdateProductCategoryDto
  ) {
    return this.productsService.updateProductCategory(+productId, dto)
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
  @UseInterceptors(FileInterceptor('file', { storage: diskStorage({}) }))
  async removeProductImage(@Param('productId') productId: string, @Param('fileId') fileId: string) {
    return this.productsService.removeProductImage(+productId, +fileId)
  }

  @Get(':productId/content')
  findAllProductContent(@Param('productId') productId: string) {
    return this.productsService.findAllProductContent(+productId)
  }

  @Post(':productId/content')
  async createProductContent(
    @Param('productId') productId: string,
    @Body() dto: CreateProductContentDto
  ) {
    return this.productsService.createProductContent(+productId, dto)
  }

  @Put(':productId/content')
  async sortProductContent(
    @Param('productId') productId: string,
    @Body() dto: SortProductContentDto
  ) {
    return this.productsService.sortProductContent(+productId, dto)
  }

  @Patch(':productId/content/:contentId')
  async updateProductContent(
    @Param('productId') productId: string,
    @Param('contentId') contentId: string,
    @Body() dto: UpdateProductContentDto
  ) {
    return this.productsService.updateProductContent(+productId, +contentId, dto)
  }

  @Delete(':productId/content/:contentId')
  @UseInterceptors(FileInterceptor('file', { storage: diskStorage({}) }))
  async removeProductContent(
    @Param('productId') productId: string,
    @Param('contentId') contentId: string
  ) {
    return this.productsService.removeProductContent(+productId, +contentId)
  }
}
