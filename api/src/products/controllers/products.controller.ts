import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  Put
} from '@nestjs/common'
import { ProductsService } from '../services/products.service'
import { CreateProductDto } from '../dto/create-product.dto'
import { UpdateProductDto } from '../dto/update-product.dto'
import { FindAllProductQueryDto } from '../dto/find-all-product-query.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { UpdateProductImageDto } from '../dto/update-product-image.dto'
import { SortProductImageDto } from '../dto/sort-product-image.dto'

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id)
  }

  @Get(':productId/images')
  findAllProductImages(@Param('productId') productId: string) {
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
}
