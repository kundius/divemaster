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
  UploadedFile
} from '@nestjs/common'
import { ProductsService } from '../services/products.service'
import { CreateProductDto } from '../dto/create-product.dto'
import { UpdateProductDto } from '../dto/update-product.dto'
import { FindAllProductQueryDto } from '../dto/find-all-product-query.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'

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

  @Get(':id/images')
  findAllProductImages(@Param('id') id: string) {
    return this.productsService.productImageFindAll(+id)
  }

  @Post(':id/images')
  @UseInterceptors(FileInterceptor('file', { storage: diskStorage({}) }))
  async createProductImage(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    console.log(id, file)
    return this.productsService.productImageCreate(+id, file)
  }
}
