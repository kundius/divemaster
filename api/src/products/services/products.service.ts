import { nanoid, njk, pluck, slugify } from '@/lib/utils'
import { NotificationsService } from '@/notifications/services/notifications.service'
import { StorageService } from '@/storage/services/storage.service'
import { isArray, isBoolean, isDeepEqual, isNumber, isString, isUndefined } from '@modyqyw/utils'
import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { join } from 'path'
import {
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsWhere,
  In,
  IsNull,
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
// import { OptionValue } from '../entities/option-value.entity'
import { Property, PropertyType } from '../entities/property.entity'
import { ProductImage } from '../entities/product-image.entity'
import { Product } from '../entities/product.entity'
import { ProductsFilterService } from './products-filter.service'
import { ProductOption } from '../entities/product-option.entity'
import { OfferOption } from '../entities/offer-option.entity'

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductOption)
    private productOptionRepository: Repository<ProductOption>,
    @InjectRepository(OfferOption)
    private offerOptionRepository: Repository<OfferOption>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private productImageRepository: Repository<ProductImage>,
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
    // @InjectRepository(OptionValue)
    // private optionValueRepository: Repository<OptionValue>,
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
      where.categories = { id: In([dto.category]) }
    }

    if (dto.filter) {
      let filter = {}
      try {
        filter = JSON.parse(dto.filter)
      } catch {}
      await this.productsFilterService.init(dto.category)
      const productIds = await this.productsFilterService.search(filter)
      if (productIds.length > 0) {
        where.id = In(productIds)
      } else {
        where.id = IsNull()
      }
    }

    const [rows, total] = await this.productRepository.findAndCount({
      where,
      take: dto.take,
      skip: dto.skip,
      relations: {
        brand: true,
        categories: true
      }
    })

    await Promise.all(
      rows.map(async (row) => {
        const [options, images, offers, properties] = await Promise.all([
          this.productOptionRepository.find({
            where: {
              productId: row.id
            },
            order: {
              rank: 'ASC'
            }
          }),
          this.productImageRepository.find({
            where: {
              productId: row.id,
              active: true
            },
            order: {
              rank: 'ASC'
            }
          }),
          this.offerRepository.find({
            where: {
              productId: row.id
            },
            order: {
              rank: 'ASC'
            },
            relations: {
              options: true
            }
          }),
          this.findPropertiesForProduct(row.id)
        ])

        row.options = options
        row.images = images
        row.offers = offers
        row.properties = properties
      })
    )

    return { rows, total, filters: this.productsFilterService.filters }
  }

  async findOne(id: number, dto?: FindOneProductDto) {
    const where: FindOptionsWhere<Product> = {
      id,
      images: { active: true }
    }

    if (dto?.active) {
      where.active = true
    }

    const product = await this.productRepository.findOne({
      where,
      relations: {
        offers: { options: true },
        options: true,
        images: true,
        brand: true,
        categories: true
      },
      order: {
        options: { rank: 'ASC' },
        images: { rank: 'ASC' },
        offers: { rank: 'ASC' }
      }
    })

    if (product) {
      product.properties = await this.findPropertiesForProduct(product.id)
    }

    return product
  }

  async findOneByAlias(alias: string, dto?: FindOneProductDto) {
    const where: FindOptionsWhere<Product> = {
      alias,
      images: { active: true }
    }

    if (dto?.active) {
      where.active = true
    }

    const product = await this.productRepository.findOne({
      where,
      relations: {
        offers: { options: true },
        options: true,
        images: true,
        brand: true,
        categories: true
      },
      order: {
        options: { rank: 'ASC' },
        images: { rank: 'ASC' },
        offers: { rank: 'ASC' }
      }
    })

    if (product) {
      product.properties = await this.findPropertiesForProduct(product.id)
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

  async findPropertiesForProduct(productId: number) {
    return this.propertyRepository.find({
      where: {
        categories: { products: { id: productId } }
      },
      order: {
        rank: 'asc'
      }
    })
  }

  async updateOptions(productId: number, values: UpdateProductOptions) {
    const options = await this.findPropertiesForProduct(productId)

    const multipleUpdater = async (option: Property) => {
      const value = values[option.key]

      const productOptions = await this.productOptionRepository.find({
        where: { productId, name: option.key },
        order: { rank: 'asc' }
      })

      if (isUndefined(value)) {
        await this.productOptionRepository.delete({ productId, name: option.key })
        return
      }

      if (isArray(value, isString)) {
        // удаляем лишние варианты и меняем порядок для остальных
        for (const productOption of productOptions) {
          const index = value.indexOf(productOption.content)
          if (index === -1) {
            await this.productOptionRepository.delete({ id: productOption.id })
            continue
          }
          await this.productOptionRepository.update({ id: productOption.id }, { rank: index })
          delete value[index]
        }
        // добавляем новые варианты
        for (const key in value) {
          await this.productOptionRepository.insert({
            productId,
            name: option.key,
            content: value[key],
            rank: Number(key)
          })
        }
        return
      }

      throw new Error('Invalid value type')
    }

    const singleUpdater = async (option: Property) => {
      const value = values[option.key]

      if (isUndefined(value)) {
        await this.productOptionRepository.delete({ productId, name: option.key })
        return
      }

      if (isString(value)) {
        await this.productOptionRepository.upsert(
          {
            productId,
            name: option.key,
            content: value
          },
          ['productId', 'name']
        )
        return
      }

      if (isBoolean(value)) {
        await this.productOptionRepository.upsert(
          {
            productId,
            name: option.key,
            content: value ? '1' : '0'
          },
          ['productId', 'name']
        )
        return
      }

      if (isNumber(value)) {
        await this.productOptionRepository.upsert(
          {
            productId,
            name: option.key,
            content: String(value)
          },
          ['productId', 'name']
        )
        return
      }

      throw new Error('Invalid value type')
    }

    const updaters = {
      [PropertyType.COMBOBOOLEAN]: singleUpdater,
      // [OptionType.COMBOBOX]: singleUpdater,
      [PropertyType.COMBOCOLORS]: multipleUpdater,
      [PropertyType.COMBOOPTIONS]: multipleUpdater,
      [PropertyType.NUMBERFIELD]: singleUpdater,
      // [OptionType.TEXTAREA]: singleUpdater,
      [PropertyType.TEXTFIELD]: singleUpdater
    }

    for (const option of options) {
      await updaters[option.type](option)
    }
  }

  async findAllOffers(productId: number) {
    return this.offerRepository.find({
      where: { product: { id: productId } },
      order: { rank: 'asc' },
      relations: { options: true }
    })
  }

  async createOffer(productId: number, dto: CreateOfferDto) {
    const otherOffers = await this.offerRepository.find({
      where: { productId },
      relations: { options: true }
    })

    // предотвратить дублирование оффера
    for (const currentOffer of otherOffers) {
      const a1 = currentOffer.options
        .map((option) => [option.name, option.content])
        .sort((a, b) => a[0].localeCompare(b[0]))
      const a2 = Object.entries(dto.options).sort((a, b) => a[0].localeCompare(b[0]))
      if (isDeepEqual(a1, a2)) {
        throw new BadRequestException('Торговое предложение с указанными опциями уже сущесивует')
      }
    }

    const offer = this.offerRepository.create({
      productId,
      price: dto.price,
      title: dto.title
    })

    await this.offerRepository.save(offer)

    // добваить новые опции оффера
    for (const [name, content] of Object.entries(dto.options)) {
      const offerOption = this.offerOptionRepository.create({
        name,
        content,
        offer
      })
      await this.offerOptionRepository.save(offerOption)
    }

    return offer
  }

  async removeOffer(id: number) {
    await this.offerRepository.delete({ id })
  }

  async updateOffer(id: number, dto: UpdateOfferDto) {
    const offer = await this.offerRepository.findOneOrFail({
      where: { id }
    })

    // предотвратить дублирование оффера
    const otherOffers = await this.offerRepository.find({
      where: { productId: offer.productId, id: Not(offer.id) },
      relations: { options: true }
    })
    for (const currentOffer of otherOffers) {
      const a1 = currentOffer.options
        .map((option) => [option.name, option.content])
        .sort((a, b) => a[0].localeCompare(b[0]))
      const a2 = Object.entries(dto.options).sort((a, b) => a[0].localeCompare(b[0]))
      if (isDeepEqual(a1, a2)) {
        throw new BadRequestException('Торговое предложение с указанными опциями уже сущесивует')
      }
    }

    offer.price = dto.price
    offer.title = dto.title

    await this.offerRepository.save(offer)

    // удалить старые опции оффера
    await this.offerOptionRepository.delete({ offer })

    // добваить новые опции оффера
    for (const [name, content] of Object.entries(dto.options)) {
      const offerOption = this.offerOptionRepository.create({
        name,
        content,
        offer
      })
      await this.offerOptionRepository.save(offerOption)
    }
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
