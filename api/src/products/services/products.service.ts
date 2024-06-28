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
import { Injectable } from '@nestjs/common'
import { join } from 'path'
import {
  CreateProductDto,
  FindAllProductDto,
  FindOneProductDto,
  SortProductImageDto,
  UpdateProductCategoryDto,
  UpdateProductDto,
  UpdateProductImageDto
} from '../dto/products.dto'
import { Brand } from '../entities/brand.entity'
import { Category } from '../entities/category.entity'
import { ProductImage } from '../entities/product-image.entity'
import { Product } from '../entities/product.entity'
import { Option, OptionType } from '../entities/option.entity'
import { OptionVariant } from '../entities/option-variant.entity'

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: EntityRepository<Product>,
    @InjectRepository(ProductImage)
    private productImageRepository: EntityRepository<ProductImage>,
    @InjectRepository(Category)
    private categoryRepository: EntityRepository<Category>,
    @InjectRepository(Option)
    private optionRepository: EntityRepository<Option>,
    @InjectRepository(OptionVariant)
    private optionVariantRepository: EntityRepository<OptionVariant>,
    @InjectRepository(Brand)
    private brandRepository: EntityRepository<Brand>,
    private storageService: StorageService
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

    let where: ObjectQuery<Product> = {}
    if (dto.query) {
      where = { ...where, title: { $like: '%' + dto.query + '%' } }
    }
    if (typeof dto.category !== 'undefined') {
      // TODO: HIERARCHY_DEPTH_LIMIT
      // товары выбираются без учета подкатегорий
      where = { ...where, categories: { $in: [dto.category] } }
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

    return { rows, total }
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
      await this.productImageRepository.getEntityManager().persist(productImage)
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
    await product.categories.removeAll()
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
      {
        categories: { $in: categoryIds }
      },
      {
        orderBy: {
          rank: QueryOrder.ASC
        }
      }
    )

    for (const option of options) {
      const optionVariants = await this.optionVariantRepository.find(
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

      let value: number | boolean | string | string[] | undefined

      if (optionVariants.length === 0) continue

      switch (option.type) {
        case OptionType.SIZE:
        case OptionType.COLOR:
        case OptionType.VARIANT:
          value = optionVariants.map((optionVariant) => optionVariant.value)
          break
        case OptionType.BOOLEAN:
          value =
            optionVariants[0].value === '1'
              ? true
              : optionVariants[0].value === '0'
                ? false
                : undefined
          break
        case OptionType.TEXT:
          value = String(optionVariants[0].value)
          break
        case OptionType.NUMBER:
          value = Number(optionVariants[0].value)
          break
      }

      wrap(option).assign({ value })
    }

    return options
  }

  async updateOptions(
    productId: number,
    values: Record<string, number | boolean | string | string[] | undefined>
  ) {
    const product = await this.findOne(productId)
    const options = await this.findAllOptions(productId)
    const em = this.optionVariantRepository.getEntityManager()

    const findVariants = async (option: Option) => {
      return this.optionVariantRepository.find(
        { option, product },
        { orderBy: { rank: QueryOrder.ASC } }
      )
    }

    const findOrCreateVariant = async (option: Option) => {
      const variant = await this.optionVariantRepository.findOne(
        { option, product },
        { orderBy: { rank: QueryOrder.ASC } }
      )

      if (!variant) {
        return this.optionVariantRepository.create({
          option,
          product,
          value: '',
          rank: 0
        })
      }

      return variant
    }

    const variantUpdater = async (option: Option) => {
      const value = values[option.key]
      const variants = await findVariants(option)

      if (typeof value === 'undefined') {
        for (const variant of variants) {
          em.remove(variant)
        }
        return
      }

      if (Array.isArray(value)) {
        // удаляем лишние вариаты и меняем ранги для остальных
        for (const variant of variants) {
          const index = value.indexOf(variant.value)
          if (index === -1) {
            em.remove(variant)
            continue
          }
          variant.rank = index
          delete value[index]
        }
        // добавляем новые варианты
        for (const key in value) {
          this.optionVariantRepository.create({
            option,
            product,
            value: value[key],
            rank: Number(key)
          })
        }
        return
      }

      throw new Error('Invalid value type')
    }

    const booleanUpdater = async (option: Option) => {
      const value = values[option.key]
      const variant = await findOrCreateVariant(option)

      if (typeof value === 'undefined') {
        em.remove(variant)
        return
      }

      if (typeof value === 'boolean') {
        variant.value = value ? '1' : '0'
        return
      }

      throw new Error('Invalid value type')
    }

    const textUpdater = async (option: Option) => {
      const value = values[option.key]
      const variant = await findOrCreateVariant(option)

      if (typeof value === 'undefined') {
        em.remove(variant)
        return
      }

      if (typeof value === 'string') {
        variant.value = value
        return
      }

      throw new Error('Invalid value type')
    }

    const numberUpdater = async (option: Option) => {
      const value = values[option.key]
      const variant = await findOrCreateVariant(option)

      if (typeof value === 'undefined') {
        em.remove(variant)
        return
      }

      if (typeof value === 'number') {
        variant.value = String(value)
        return
      }

      throw new Error('Invalid value type')
    }

    const updaters = {
      [OptionType.SIZE]: variantUpdater,
      [OptionType.COLOR]: variantUpdater,
      [OptionType.VARIANT]: variantUpdater,
      [OptionType.BOOLEAN]: booleanUpdater,
      [OptionType.TEXT]: textUpdater,
      [OptionType.NUMBER]: numberUpdater
    }

    for (const option of options) {
      await updaters[option.type](option)
    }

    await em.flush()
  }
}
