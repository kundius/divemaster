import { nanoid } from '@/lib/utils'
import { StorageService } from '@/storage/services/storage.service'
import {
  EntityRepository,
  FilterOptions,
  ObjectQuery,
  OrderDefinition,
  Populate,
  QueryOrder,
  wrap
} from '@mikro-orm/mariadb'
import { InjectRepository } from '@mikro-orm/nestjs'
import { isArray, isBoolean, isNumber, isString, isUndefined } from '@modyqyw/utils'
import { Injectable } from '@nestjs/common'
import { join } from 'path'
import {
  CreateProductDto,
  FindAllProductDto,
  FindOneProductDto,
  CreateOfferDto,
  SortProductImageDto,
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
    private readonly productsRepository: EntityRepository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: EntityRepository<ProductImage>,
    @InjectRepository(Category)
    private readonly categoryRepository: EntityRepository<Category>,
    @InjectRepository(Option)
    private readonly optionRepository: EntityRepository<Option>,
    @InjectRepository(OptionValue)
    private readonly optionValueRepository: EntityRepository<OptionValue>,
    @InjectRepository(Brand)
    private readonly brandRepository: EntityRepository<Brand>,
    @InjectRepository(Offer)
    private readonly offerRepository: EntityRepository<Offer>,
    private readonly storageService: StorageService,
    private readonly productsFilterService: ProductsFilterService
  ) {}

  async create({ brandId, ...fillable }: CreateProductDto) {
    const product = new Product()

    this.productsRepository.assign(product, fillable)

    if (typeof brandId !== 'undefined') {
      product.brand = brandId ? await this.brandRepository.findOneOrFail({ id: +brandId }) : null
    }

    await this.productsRepository.getEntityManager().persistAndFlush(product)

    return product
  }

  async findAll(dto: FindAllProductDto) {
    let exclude: ('description' | 'specifications' | 'exploitation')[] = []
    let populate: Populate<Product, 'images' | 'brand' | 'categories'> = []
    let filters: FilterOptions = []
    let populateOrderBy: OrderDefinition<Product> = {}
    let populateWhere: ObjectQuery<Product> = {}
    let where: ObjectQuery<Product> = {}

    if (dto.withImages) {
      populate = [...populate, 'images']
      populateOrderBy = { ...populateOrderBy, images: { rank: QueryOrder.ASC } }
      populateWhere = { ...populateWhere, images: { active: true } }
    }

    if (dto?.withBrand) {
      populate = [...populate, 'brand']
    }

    if (dto?.withCategories) {
      populate = [...populate, 'categories']
    }

    if (!dto.withContent) {
      exclude = [...exclude, 'description', 'specifications', 'exploitation']
    }

    if (dto.active) {
      filters = [...filters, 'active']
    }

    if (dto.favorite) {
      filters = [...filters, 'favorite']
    }

    if (dto.recent) {
      filters = [...filters, 'recent']
    }

    if (dto.query) {
      where = { ...where, title: { $like: '%' + dto.query + '%' } }
    }

    if (typeof dto.category !== 'undefined') {
      // TODO: HIERARCHY_DEPTH_LIMIT
      // товары выбираются без учета подкатегорий
      where = { ...where, categories: { $in: [dto.category] } }
    }

    if (dto.filter) {
      let filter = {}
      try {
        filter = JSON.parse(dto.filter)
      } catch {}
      await this.productsFilterService.init(dto.category)
      const ids = await this.productsFilterService.search(filter)
      where = { ...where, id: { $in: ids } }
    }

    const [rows, total] = await this.productsRepository.findAndCount(where, {
      limit: dto.take,
      offset: dto.skip,
      orderBy: { [dto.sort]: dto.dir },
      filters,
      exclude,
      populate,
      populateOrderBy,
      populateWhere
    })

    if (dto.withOptions) {
      await Promise.all(
        rows.map(async (item) => wrap(item).assign({ options: await this.findAllOptions(item.id) }))
      )
    }

    return { rows, total, filters: this.productsFilterService.filters }
  }

  async findOne(id: number, dto?: FindOneProductDto) {
    let exclude: ('description' | 'specifications' | 'exploitation')[] = []
    let populate: Populate<Product, 'images' | 'brand' | 'categories'> = []
    let filters: FilterOptions = []
    let populateOrderBy: OrderDefinition<Product> = {}
    let populateWhere: ObjectQuery<Product> = {}

    if (dto?.withImages) {
      populate = [...populate, 'images']
      populateOrderBy = { ...populateOrderBy, images: { rank: QueryOrder.ASC } }
      populateWhere = { ...populateWhere, images: { active: true } }
    }

    if (dto?.withBrand) {
      populate = [...populate, 'brand']
    }

    if (dto?.withCategories) {
      populate = [...populate, 'categories']
    }

    if (!dto?.withContent) {
      exclude = [...exclude, 'description', 'specifications', 'exploitation']
    }

    if (dto?.active) {
      filters = [...filters, 'active']
    }

    const product = await this.productsRepository.findOneOrFail(
      { id },
      {
        filters,
        exclude,
        populate,
        populateOrderBy,
        populateWhere
      }
    )

    if (dto?.withOptions) {
      wrap(product).assign({ options: await this.findAllOptions(product.id) })
    }

    return product
  }

  async findOneByAlias(alias: string, dto?: FindOneProductDto) {
    let exclude: ('description' | 'specifications' | 'exploitation')[] = []
    let populate: Populate<Product, 'images' | 'brand' | 'categories'> = []
    let filters: FilterOptions = []
    let populateOrderBy: OrderDefinition<Product> = {}
    let populateWhere: ObjectQuery<Product> = {}

    if (dto?.withImages) {
      populate = [...populate, 'images']
      populateOrderBy = { ...populateOrderBy, images: { rank: QueryOrder.ASC } }
      populateWhere = { ...populateWhere, images: { active: true } }
    }

    if (dto?.withBrand) {
      populate = [...populate, 'brand']
    }

    if (dto?.withCategories) {
      populate = [...populate, 'categories']
    }

    if (!dto?.withContent) {
      exclude = [...exclude, 'description', 'specifications', 'exploitation']
    }

    if (dto?.active) {
      filters = [...filters, 'active']
    }

    const product = await this.productsRepository.findOne(
      { alias },
      {
        filters,
        exclude,
        populate,
        populateOrderBy,
        populateWhere
      }
    )

    if (product && dto?.withOptions) {
      wrap(product).assign({ options: await this.findAllOptions(product.id) })
    }

    return product
  }

  async update(id: number, { brandId, ...fillable }: UpdateProductDto) {
    const product = await this.findOne(id)

    this.productsRepository.assign(product, fillable)

    if (typeof brandId !== 'undefined') {
      product.brand = brandId ? await this.brandRepository.findOneOrFail({ id: +brandId }) : null
    }

    await this.productsRepository.getEntityManager().persistAndFlush(product)
  }

  async remove(id: number) {
    const product = await this.productsRepository.findOneOrFail({ id })
    await this.productsRepository.getEntityManager().removeAndFlush(product)
  }

  async createProductImage(productId: number, upload: Express.Multer.File) {
    const product = await this.productsRepository.findOneOrFail(
      { id: productId },
      {
        populate: ['images']
      }
    )

    const file = await this.storageService.upload(
      upload,
      join(String(productId), `${nanoid()}-${upload.originalname}`)
    )
    const productImage = new ProductImage()
    productImage.file = file
    productImage.product = product
    productImage.rank = product.images.length
    await this.productImageRepository.getEntityManager().persistAndFlush(productImage)
    return productImage
  }

  async findAllProductImage(productId: number) {
    const product = await this.productsRepository.findOneOrFail({ id: productId })
    return await this.productImageRepository.find(
      { product },
      {
        orderBy: {
          rank: QueryOrder.ASC
        }
      }
    )
  }

  async findOneProductImage(productId: number, fileId: number) {
    const product = await this.productsRepository.findOneOrFail({ id: productId })
    const file = await this.storageService.findOneOrFail(fileId)
    return this.productImageRepository.findOneOrFail({ product, file })
  }

  async updateProductImage(
    productId: number,
    fileId: number,
    { ...fillable }: UpdateProductImageDto
  ) {
    const productImage = await this.findOneProductImage(productId, fileId)

    this.productImageRepository.assign(productImage, fillable)

    await this.productImageRepository.getEntityManager().persistAndFlush(productImage)
  }

  async sortProductImage(productId: number, { files }: SortProductImageDto) {
    const product = await this.productsRepository.findOneOrFail({ id: productId })
    for (const fileId of Object.keys(files)) {
      const file = await this.storageService.findOneOrFail(+fileId)
      const productImage = await this.productImageRepository.findOneOrFail({
        product,
        file
      })
      productImage.rank = files[fileId]
      this.productImageRepository.getEntityManager().persist(productImage)
    }
    await this.productImageRepository.getEntityManager().flush()
  }

  async removeProductImage(productId: number, fileId: number) {
    const product = await this.productsRepository.findOneOrFail({ id: productId })
    const file = await this.storageService.findOneOrFail(fileId)
    const productImage = await this.productImageRepository.findOneOrFail({ product, file })
    await this.productImageRepository.getEntityManager().removeAndFlush(productImage)
    await this.storageService.remove(fileId)
  }

  async findAllCategory(productId: number) {
    const product = await this.productsRepository.findOne(
      { id: productId },
      {
        populate: ['categories']
      }
    )
    return product?.categories || []
  }

  async updateCategory(productId: number, { categories }: UpdateProductCategoryDto) {
    const product = await this.productsRepository.findOneOrFail({ id: productId })
    product.categories.removeAll()
    for (const categoryId of categories) {
      const category = await this.categoryRepository.findOneOrFail({ id: +categoryId })
      product.categories.add(category)
    }
    await this.productsRepository.getEntityManager().persistAndFlush(product)
  }

  async findAllOptions(productId: number) {
    const categories = await this.categoryRepository.find({
      products: { $in: [productId] }
    })
    const categoryIds = categories.map((category) => category.id) || []
    const options = await this.optionRepository.find(
      { categories: { $in: categoryIds } },
      {
        orderBy: { rank: QueryOrder.ASC },
        populate: ['values'],
        populateWhere: { values: { product: productId } }
      }
    )

    for (const option of options) {
      const optionValues = await this.optionValueRepository.find(
        {
          option,
          product: productId
        },
        {
          orderBy: {
            rank: QueryOrder.ASC
          }
        }
      )

      let value: Option['value']

      if (optionValues.length === 0) continue

      switch (option.type) {
        case OptionType.TEXTFIELD:
          // case OptionType.TEXTAREA:
          // case OptionType.COMBOBOX:
          value = optionValues[0].content
          break
        case OptionType.COMBOBOOLEAN:
          value = optionValues[0].content === '1'
          break
        case OptionType.NUMBERFIELD:
          value = Number(optionValues[0].content)
          break
        case OptionType.COMBOCOLORS:
        case OptionType.COMBOOPTIONS:
          value = optionValues.map((optionValue) => optionValue.content)
          break
      }

      wrap(option).assign({ value })
    }

    return options
  }

  async updateOptions(productId: number, values: UpdateProductOptions) {
    const product = await this.findOne(productId)
    const options = await this.findAllOptions(productId)
    const em = this.optionValueRepository.getEntityManager()

    const findOptionValues = async (option: Option) => {
      return this.optionValueRepository.find(
        { option, product },
        { orderBy: { rank: QueryOrder.ASC } }
      )
    }

    const findOrCreateOptionValue = async (option: Option) => {
      const variant = await this.optionValueRepository.findOne(
        { option, product },
        { orderBy: { rank: QueryOrder.ASC } }
      )

      if (!variant) {
        return this.optionValueRepository.create({
          option,
          product,
          content: '',
          rank: 0
        })
      }

      return variant
    }

    const multipleUpdater = async (option: Option) => {
      const value = values[option.key]

      const optionValues = await findOptionValues(option)

      if (isUndefined(value)) {
        for (const optionValue of optionValues) {
          em.remove(optionValue)
        }
        return
      }

      if (isArray(value, isString)) {
        // удаляем лишние варианты и меняем ранги для остальных
        for (const optionValue of optionValues) {
          const index = value.indexOf(optionValue.content)
          if (index === -1) {
            em.remove(optionValue)
            continue
          }
          optionValue.rank = index
          delete value[index]
        }
        // добавляем новые варианты
        for (const key in value) {
          this.optionValueRepository.create({
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
        em.remove(optionValue)
        return
      }

      if (isNumber(value)) {
        optionValue.content = String(value)
        return
      }

      if (isBoolean(value)) {
        optionValue.content = value ? '1' : '0'
        return
      }

      if (isString(value)) {
        optionValue.content = value
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

    await em.flush()
  }

  async findAllOffers(productId: number) {
    const product = await this.productsRepository.findOneOrFail({ id: productId })
    return this.offerRepository.find(
      { product },
      {
        orderBy: {
          rank: QueryOrder.ASC
        },
        populate: ['optionValues']
      }
    )
  }

  async createOffer(productId: number, dto: CreateOfferDto) {
    const product = await this.productsRepository.findOneOrFail({ id: productId })

    const offer = new Offer()

    this.offerRepository.assign(offer, {
      product,
      price: dto.price,
      title: dto.title,
      optionValues: dto.optionValues
    })

    await this.offerRepository.getEntityManager().persistAndFlush(offer)

    return offer
  }
}
