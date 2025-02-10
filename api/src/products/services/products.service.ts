import { nanoid, njk, pluck, slugify } from '@/lib/utils'
import { NotificationsService } from '@/notifications/services/notifications.service'
import { StorageService } from '@/storage/services/storage.service'
import { isArray, isBoolean, isNumber, isString, isUndefined } from '@modyqyw/utils'
import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { join } from 'path'
import {
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsWhere,
  In,
  Like,
  Not,
  Repository
} from 'typeorm'
import {
  CreateOfferDto,
  CreateProductDto,
  FindAllProductDto,
  FindOneProductDto,
  OrderByClickProductDto,
  SortProductImageDto,
  UpdateOfferDto,
  UpdateProductCategoryDto,
  UpdateProductDto,
  UpdateProductImageDto,
  UpdateProductOptions
} from '../dto/products.dto'
import { Brand } from '../entities/brand.entity'
import { Category } from '../entities/category.entity'
import { Offer } from '../entities/offer.entity'
import { OptionValue } from '../entities/option-value.entity'
import { Option, OptionType } from '../entities/option.entity'
import { ProductImage } from '../entities/product-image.entity'
import { Product } from '../entities/product.entity'
import { ProductsFilterService } from './products-filter.service'

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private productImageRepository: Repository<ProductImage>,
    @InjectRepository(Option)
    private optionRepository: Repository<Option>,
    @InjectRepository(OptionValue)
    private optionValueRepository: Repository<OptionValue>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
    private readonly notificationsService: NotificationsService,
    private readonly storageService: StorageService,
    private readonly productsFilterService: ProductsFilterService,
    private readonly configService: ConfigService
  ) {}

  async makeAlias(from: string, unique: boolean = false) {
    let alias = slugify(from)

    if (unique) {
      const fn = async (n: number) => {
        const tmp = n !== 0 ? `${alias}-${n}` : alias
        const record = await this.productRepository.findOne({
          where: { alias: tmp }
        })
        return record ? fn(n + 1) : tmp
      }
      alias = await fn(0)
    }

    return alias
  }

  async create({ brandId, rank, ...fillable }: CreateProductDto) {
    const record = new Product()

    this.productRepository.merge(record, fillable)

    record.rank = rank || 0

    if (typeof brandId !== 'undefined') {
      record.brandId = brandId
    }

    await this.productRepository.save(record)

    return record
  }

  async findAll(dto: FindAllProductDto) {
    const where: FindOptionsWhere<Product> = {}
    const relations: FindOptionsRelations<Product> = {}
    const order: FindOptionsOrder<Product> = {}

    if (dto.withImages) {
      relations.images = true
      where.images = { active: true }
      order.images = { rank: 'asc' }
    }

    if (dto?.withOffers) {
      relations.offers = { optionValues: true }
    }

    if (dto?.withOptions) {
      relations.optionValues = true
    }

    if (dto?.withBrand) {
      relations.brand = true
    }

    if (dto?.withCategories) {
      relations.categories = true
    }

    if (dto.favorite) {
      where.favorite = true
    }

    if (dto.recent) {
      where.recent = true
    }

    if (dto.active) {
      where.active = true
    }

    if (dto.query) {
      where.title = Like(`%${dto.query}%`)
    }

    if (typeof dto.category !== 'undefined') {
      // TODO: HIERARCHY_DEPTH_LIMIT
      // товары выбираются без учета подкатегорий
      where.categories = { id: dto.category }
    }

    if (dto.filter) {
      let filter = {}
      try {
        filter = JSON.parse(dto.filter)
      } catch {}
      await this.productsFilterService.init(dto.category)
      where.id = In(await this.productsFilterService.search(filter))
    }

    const [rows, total] = await this.productRepository.findAndCount({
      where,
      relations,
      order: {
        ...order,
        [dto.sort]: dto.dir
      },
      skip: dto.skip,
      take: dto.take
    })

    if (dto.withOptions) {
      await Promise.all(
        rows.map(async (item) => {
          item.options = await this.findProductOptions(item.id)
        })
      )
    }

    return { rows, total, filters: this.productsFilterService.filters }
  }

  async findOne(id: number, dto?: FindOneProductDto) {
    const where: FindOptionsWhere<Product> = {}
    const relations: FindOptionsRelations<Product> = {}
    const order: FindOptionsOrder<Product> = {}

    where.id = id

    if (dto?.withOffers) {
      relations.offers = {
        optionValues: true
      }
    }

    if (dto?.withOptions) {
      relations.optionValues = true
    }

    if (dto?.withImages) {
      relations.images = true
      where.images = { active: true }
      order.images = { rank: 'asc' }
    }

    if (dto?.withBrand) {
      relations.brand = true
    }

    if (dto?.withCategories) {
      relations.categories = true
    }

    if (dto?.active) {
      where.active = true
    }

    const product = await this.productRepository.findOneOrFail({
      where,
      relations,
      order
    })

    if (dto?.withOptions) {
      product.options = await this.findProductOptions(product.id)
    }

    return product
  }

  async findOneByAlias(alias: string, dto?: FindOneProductDto) {
    const where: FindOptionsWhere<Product> = {}
    const relations: FindOptionsRelations<Product> = {}
    const order: FindOptionsOrder<Product> = {}

    where.alias = alias

    if (dto?.withOffers) {
      relations.offers = {
        optionValues: true
      }
    }

    if (dto?.withOptions) {
      relations.optionValues = true
    }

    if (dto?.withImages) {
      relations.images = true
      where.images = { active: true }
      order.images = { rank: 'asc' }
    }

    if (dto?.withBrand) {
      relations.brand = true
    }

    if (dto?.withCategories) {
      relations.categories = true
    }

    if (dto?.active) {
      where.active = true
    }

    const product = await this.productRepository.findOneOrFail({
      where,
      relations,
      order
    })

    if (dto?.withOptions) {
      product.options = await this.findProductOptions(product.id)
    }

    return product
  }

  async update(id: number, { brandId, ...fillable }: UpdateProductDto) {
    const record = await this.productRepository.findOneByOrFail({ id })

    this.productRepository.merge(record, fillable)

    if (typeof brandId !== 'undefined') {
      record.brandId = brandId
    }

    await this.productRepository.save(record)

    return record
  }

  async remove(id: number) {
    await this.productRepository.delete({ id })
  }

  async createProductImage(productId: number, upload: Express.Multer.File) {
    const product = await this.productRepository.findOneOrFail({
      where: { id: productId },
      relations: { images: true }
    })

    const file = await this.storageService.upload(
      upload,
      join(String(productId), `${nanoid()}-${upload.originalname}`)
    )

    const productImage = new ProductImage()

    this.productImageRepository.merge(productImage, {
      rank: product.images.length || 0,
      fileId: file.id,
      productId: product.id
    })

    await this.productImageRepository.save(productImage)

    return productImage
  }

  async findAllProductImage(productId: number) {
    return this.productImageRepository.find({
      where: { product: { id: productId } },
      order: { rank: 'asc' }
    })
  }

  async findOneProductImage(productId: number, fileId: number) {
    return this.productImageRepository.findOneOrFail({
      where: { productId: productId, fileId: fileId }
    })
  }

  async updateProductImage(
    productId: number,
    fileId: number,
    { ...fillable }: UpdateProductImageDto
  ) {
    await this.productImageRepository.update({ productId, fileId }, fillable)
  }

  async sortProductImage(productId: number, { files }: SortProductImageDto) {
    // TODO: make parallel update
    for (const fileId of Object.keys(files)) {
      await this.productImageRepository.update(
        { productId, fileId: +fileId },
        { rank: files[fileId] }
      )
    }
  }

  async removeProductImage(productId: number, fileId: number) {
    await this.productImageRepository.delete({ fileId, productId })
  }

  async findAllCategory(productId: number) {
    return this.categoryRepository.find({
      where: { products: { id: productId } }
    })
  }

  async updateCategory(productId: number, { categories }: UpdateProductCategoryDto) {
    const record = await this.productRepository.findOneOrFail({
      where: { id: productId }
    })

    record.categories = await Promise.all(
      categories.map(async (cat) => this.categoryRepository.findOneByOrFail({ id: +cat }))
    )

    await this.productRepository.save(record)
  }

  async findProductOptions(productId: number) {
    return this.optionRepository.find({
      where: {
        categories: { products: { id: productId } },
        values: { productId }
      },
      order: {
        rank: 'asc',
        values: { content: 'asc' }
      },
      relations: {
        values: true
      }
    })
  }

  async updateOptions(productId: number, values: UpdateProductOptions) {
    const product = await this.findOne(productId)
    const options = await this.findProductOptions(productId)

    const findOptionValues = async (option: Option) => {
      return this.optionValueRepository.find({
        where: { option: { id: option.id }, product: { id: product?.id } },
        order: { rank: 'asc' }
      })
    }

    const findOrCreateOptionValue = async (option: Option) => {
      let variant = await this.optionValueRepository.findOne({
        where: { option: { id: option.id }, product: { id: product?.id } },
        order: { rank: 'asc' }
      })

      if (!variant) {
        variant = new OptionValue()
        variant.option = option
        variant.product = product
        variant.content = ''
        variant.rank = 0
        await this.optionValueRepository.save(variant)
      }

      return variant
    }

    const multipleUpdater = async (option: Option) => {
      const value = values[option.key]

      const optionValues = await findOptionValues(option)

      if (isUndefined(value)) {
        for (const optionValue of optionValues) {
          await this.optionValueRepository.delete({ id: optionValue.id })
        }
        return
      }

      if (isArray(value, isString)) {
        // удаляем лишние варианты и меняем ранги для остальных
        for (const optionValue of optionValues) {
          const index = value.indexOf(optionValue.content)
          if (index === -1) {
            await this.optionValueRepository.delete({ id: optionValue.id })
            continue
          }
          await this.optionValueRepository.update({ id: optionValue.id }, { rank: index })
          delete value[index]
        }
        // добавляем новые варианты
        for (const key in value) {
          await this.optionValueRepository.insert({
            option,
            product,
            content: value[key],
            rank: Number(key)
          })
        }
        return
      }

      throw new Error('Invalid value type')
    }

    const singleUpdater = async (option: Option) => {
      const value = values[option.key]

      const optionValue = await findOrCreateOptionValue(option)

      if (isUndefined(value)) {
        await this.optionValueRepository.delete({ id: optionValue.id })
        return
      }

      if (isNumber(value)) {
        await this.optionValueRepository.update({ id: optionValue.id }, { content: String(value) })
        return
      }

      if (isBoolean(value)) {
        await this.optionValueRepository.update(
          { id: optionValue.id },
          { content: value ? '1' : '0' }
        )
        return
      }

      if (isString(value)) {
        await this.optionValueRepository.update({ id: optionValue.id }, { content: value })
        return
      }

      throw new Error('Invalid value type')
    }

    const updaters = {
      [OptionType.COMBOBOOLEAN]: singleUpdater,
      // [OptionType.COMBOBOX]: singleUpdater,
      [OptionType.COMBOCOLORS]: multipleUpdater,
      [OptionType.COMBOOPTIONS]: multipleUpdater,
      [OptionType.NUMBERFIELD]: singleUpdater,
      // [OptionType.TEXTAREA]: singleUpdater,
      [OptionType.TEXTFIELD]: singleUpdater
    }

    for (const option of options) {
      await updaters[option.type](option)
    }
  }

  async findAllOffers(productId: number) {
    return this.offerRepository.find({
      where: { product: { id: productId } },
      order: { rank: 'asc' },
      relations: { optionValues: true }
    })
  }

  async createOffer(productId: number, dto: CreateOfferDto) {
    const currentOffers = await this.offerRepository.find({
      where: { product: { id: productId } },
      relations: { optionValues: true }
    })
    const existOffer = currentOffers.find(
      (currentOffer) =>
        JSON.stringify(pluck(currentOffer.optionValues, 'id').sort()) ===
        JSON.stringify(dto.optionValues.sort())
    )
    if (existOffer) {
      throw new BadRequestException('Торговое предложение с указанными опциями уже сущесивует')
    }

    // TODO: попробовать заменить на productId
    const offer = this.offerRepository.create({
      product: await this.productRepository.findOneByOrFail({ id: productId }),
      price: dto.price,
      title: dto.title,
      optionValues: await Promise.all(
        dto.optionValues.map(async (id) => this.optionValueRepository.findOneByOrFail({ id }))
      )
    })

    await this.offerRepository.save(offer)

    return offer
  }

  async removeOffer(id: number) {
    await this.offerRepository.delete({ id })
  }

  async updateOffer(id: number, dto: UpdateOfferDto) {
    const currentOffer = await this.offerRepository.findOneOrFail({
      where: { id },
      relations: { product: true }
    })
    const currentOffers = await this.offerRepository.find({
      where: { product: { id: currentOffer.product.id }, id: Not(currentOffer.id) },
      relations: { optionValues: true }
    })
    const existOffer = currentOffers.find(
      (currentOffer) =>
        JSON.stringify(pluck(currentOffer.optionValues, 'id').sort()) ===
        JSON.stringify(dto.optionValues.sort())
    )
    if (existOffer) {
      throw new BadRequestException('Торговое предложение с указанными опциями уже сущесивует')
    }

    currentOffer.price = dto.price
    currentOffer.title = dto.title
    currentOffer.optionValues = await Promise.all(
      dto.optionValues.map(async (id) => this.optionValueRepository.findOneByOrFail({ id }))
    )
    await this.offerRepository.save(currentOffer)
  }

  async orderByClick(id: number, dto: OrderByClickProductDto) {
    const product = await this.productRepository.findOneByOrFail({ id })

    const emailAdmin = this.configService.get('app.emailAdmin')
    if (emailAdmin) {
      await this.notificationsService.sendMail({
        to: emailAdmin,
        subject: `${dto.subject} "${product.title}" на сайте divermaster.ru`,
        html: njk.render('mails/order-by-click.njk', { product, dto })
      })
    }
  }
}
