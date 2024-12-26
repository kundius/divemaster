import { nanoid, njk, pluck, slugify } from '@/lib/utils'
import { StorageService } from '@/storage/services/storage.service'
import {
  CreateRequestContext,
  EntityRepository,
  FilterOptions,
  ObjectQuery,
  OrderDefinition,
  Populate,
  QueryOrder,
  wrap
} from '@mikro-orm/mariadb'
import { InjectRepository } from '@mikro-orm/nestjs'
import { isArray, isBoolean, isNumber, isString, isUndefined, sleep } from '@modyqyw/utils'
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common'
import { join } from 'path'
import zlib from 'node:zlib'
import {
  CreateProductDto,
  FindAllProductDto,
  FindOneProductDto,
  CreateOfferDto,
  SortProductImageDto,
  UpdateProductCategoryDto,
  UpdateProductDto,
  UpdateProductImageDto,
  UpdateProductOptions,
  UpdateOfferDto,
  OrderByClickProductDto
} from '../dto/products.dto'
import { Brand } from '../entities/brand.entity'
import { Category } from '../entities/category.entity'
import { Offer } from '../entities/offer.entity'
import { OptionValue } from '../entities/option-value.entity'
import { Option, OptionType } from '../entities/option.entity'
import { ProductImage } from '../entities/product-image.entity'
import { Product } from '../entities/product.entity'
import { ProductsFilterService } from './products-filter.service'
import { content as letterByClick } from '@/notifications/templates/order/by-click'
import { NotificationsService } from '@/notifications/services/notifications.service'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '@/prisma.service'
import { Prisma } from '@prisma/client'
import { connect } from 'node:http2'

@Injectable()
export class ProductsService {
  constructor(
    private readonly prismaService: PrismaService,
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
    private readonly notificationsService: NotificationsService,
    private readonly storageService: StorageService,
    private readonly productsFilterService: ProductsFilterService,
    private readonly configService: ConfigService
  ) {}

  async create({ brandId, rank, ...fillable }: CreateProductDto) {
    const product = await this.prismaService.product.create({
      data: {
        ...fillable,
        rank: rank || 0,
        brand: brandId ? { connect: { id: +brandId } } : undefined
      }
    })
    return product
  }

  async findAll(dto: FindAllProductDto) {
    const args: Prisma.ProductFindManyArgs = {}

    args.where = {}
    args.include = {}

    if (dto.withImages) {
      args.include.images = {
        include: {
          file: true
        },
        where: {
          active: true
        },
        orderBy: {
          rank: 'asc'
        }
      }
    }

    if (dto?.withOffers) {
      args.include.offers = {
        include: {
          optionValues: true
        }
      }
    }

    if (dto?.withOptions) {
      args.include.optionValues = true
    }

    if (dto?.withBrand) {
      args.include.brand = true
    }

    if (dto?.withCategories) {
      args.include.categories = true
    }

    if (!dto.withContent) {
      args.omit = { description: true, specifications: true, exploitation: true }
    }

    if (dto.active) {
      args.where.active = true
    }

    if (dto.favorite) {
      args.where.favorite = true
    }

    if (dto.recent) {
      args.where.recent = true
    }

    if (dto.query) {
      args.where.title = { contains: dto.query }
    }

    if (typeof dto.category !== 'undefined') {
      // TODO: HIERARCHY_DEPTH_LIMIT
      // товары выбираются без учета подкатегорий
      args.where.categories = {
        some: {
          category_id: dto.category
        }
      }
    }

    if (dto.filter) {
      let filter = {}
      try {
        filter = JSON.parse(dto.filter)
      } catch {}
      await this.productsFilterService.init(dto.category)
      const ids = await this.productsFilterService.search(filter)
      args.where.id = {
        in: ids
      }
    }

    args.orderBy = { [dto.sort]: dto.dir.toLowerCase() }
    args.skip = dto.skip
    args.take = dto.take

    const rows = await this.prismaService.product.findMany(args)
    const total = await this.prismaService.product.count({ where: args.where })

    // if (dto.withOptions) {
    //   await Promise.all(
    //     rows.map(async (item) =>
    //       wrap(item).assign({ options: await this.findProductOptions(item.id) })
    //     )
    //   )
    // }

    return { rows, total, filters: this.productsFilterService.filters }
  }

  async findOne(id: number, dto?: FindOneProductDto) {
    const args: Prisma.ProductFindUniqueArgs = { where: { id } }

    args.include = {}

    if (dto?.withOffers) {
      args.include.offers = {
        include: { optionValues: true }
      }
    }

    if (dto?.withOptions) {
      args.include.optionValues = true
    }

    if (dto?.withImages) {
      args.include.images = {
        include: { file: true },
        where: { active: true },
        orderBy: { rank: 'asc' }
      }
    }

    if (dto?.withBrand) {
      args.include.brand = true
    }

    if (dto?.withCategories) {
      args.include.categories = true
    }

    if (!dto?.withContent) {
      args.omit = { description: true, specifications: true, exploitation: true }
    }

    if (dto?.active) {
      args.where.active = true
    }

    const product = await this.prismaService.product.findUnique(args)

    // if (dto?.withOptions) {
    //   wrap(product).assign({ options: await this.findProductOptions(product.id) })
    // }

    return product
  }

  async findOneByAlias(alias: string, dto?: FindOneProductDto) {
    const args: Prisma.ProductFindUniqueArgs = { where: { alias } }

    args.include = {}

    if (dto?.withOffers) {
      args.include.offers = {
        include: { optionValues: true }
      }
    }

    if (dto?.withOptions) {
      args.include.optionValues = true
    }

    if (dto?.withImages) {
      args.include.images = {
        include: { file: true },
        where: { active: true },
        orderBy: { rank: 'asc' }
      }
    }

    if (dto?.withBrand) {
      args.include.brand = true
    }

    if (dto?.withCategories) {
      args.include.categories = true
    }

    if (!dto?.withContent) {
      args.omit = { description: true, specifications: true, exploitation: true }
    }

    if (dto?.active) {
      args.where.active = true
    }

    const product = await this.prismaService.product.findUnique(args)

    // if (dto?.withOptions) {
    //   wrap(product).assign({ options: await this.findProductOptions(product.id) })
    // }

    return product
  }

  async update(id: number, { brandId, ...fillable }: UpdateProductDto) {
    const product = await this.prismaService.product.update({
      where: { id },
      data: {
        ...fillable,
        brand: brandId ? { connect: { id: +brandId } } : undefined
      }
    })
    return product
  }

  async remove(id: number) {
    const product = await this.prismaService.product.delete({
      where: { id }
    })
    return product
  }

  async createProductImage(productId: number, upload: Express.Multer.File) {
    const product = await this.prismaService.product.findUniqueOrThrow({
      where: { id: productId },
      include: { images: true }
    })

    const file = await this.storageService.upload(
      upload,
      join(String(productId), `${nanoid()}-${upload.originalname}`)
    )

    const productImage = await this.prismaService.productImage.create({
      data: {
        rank: product.images.length || 0,
        file: {
          connect: { id: file.id }
        },
        product: {
          connect: { id: product.id }
        }
      }
    })
    return productImage
  }

  async findAllProductImage(productId: number) {
    const productImages = await this.prismaService.productImage.findMany({
      where: { product: { id: productId } },
      orderBy: { rank: 'asc' }
    })
    return productImages
  }

  async findOneProductImage(productId: number, fileId: number) {
    const productImage = await this.prismaService.productImage.findUniqueOrThrow({
      where: { file_id_product_id: { product_id: productId, file_id: fileId } }
    })
    return productImage
  }

  async updateProductImage(
    productId: number,
    fileId: number,
    { ...fillable }: UpdateProductImageDto
  ) {
    const productImage = await this.prismaService.productImage.update({
      where: { file_id_product_id: { product_id: productId, file_id: fileId } },
      data: { ...fillable }
    })
    return productImage
  }

  async sortProductImage(productId: number, { files }: SortProductImageDto) {
    for (const fileId of Object.keys(files)) {
      await this.prismaService.productImage.update({
        where: { file_id_product_id: { product_id: productId, file_id: +fileId } },
        data: { rank: files[fileId] }
      })
    }
  }

  async removeProductImage(productId: number, fileId: number) {
    const productImage = await this.prismaService.productImage.delete({
      where: { file_id_product_id: { file_id: fileId, product_id: productId } }
    })
    return productImage
  }

  async findAllCategory(productId: number) {
    const product = await this.prismaService.product.findUniqueOrThrow({
      where: { id: productId },
      include: { categories: true }
    })
    return product.categories
  }

  async updateCategory(productId: number, { categories }: UpdateProductCategoryDto) {
    const product = await this.prismaService.product.update({
      where: { id: productId },
      data: {
        categories: {
          set: categories.map((categoryId) => ({
            category_id_product_id: { category_id: +categoryId, product_id: productId }
          }))
        }
      }
    })
    return product
  }

  async findProductOptions(productId: number) {
    const categories = await this.prismaService.category.findMany({
      where: { products: { some: { product_id: productId } } }
    })
    const categoryIds = categories.map((category) => category.id) || []
    const options = await this.prismaService.option.findMany({
      where: { categories: { some: { category_id: { in: categoryIds } } } },
      orderBy: { rank: 'asc' }
    })
    return options
  }

  async updateOptions(productId: number, values: UpdateProductOptions) {
    const product = await this.findOne(productId)
    const options = await this.findProductOptions(productId)

    const findOptionValues = async (option: Option) => {
      return this.prismaService.optionValue.findMany({
        where: { option: { id: option.id }, product: { id: product?.id } },
        orderBy: { rank: 'asc' }
      })
    }

    const findOrCreateOptionValue = async (option: Option) => {
      const variant = await this.prismaService.optionValue.findFirst({
        where: { option: { id: option.id }, product: { id: product?.id } },
        orderBy: { rank: 'asc' }
      })

      if (!variant) {
        return await this.prismaService.optionValue.create({
          data: {
            option: { connect: { id: option.id } },
            product: { connect: { id: product?.id } },
            content: '',
            rank: 0
          }
        })
      }

      return variant
    }

    const multipleUpdater = async (option: Option) => {
      const value = values[option.key]

      const optionValues = await findOptionValues(option)

      if (isUndefined(value)) {
        for (const optionValue of optionValues) {
          await this.prismaService.optionValue.delete({ where: { id: optionValue.id } })
        }
        return
      }

      if (isArray(value, isString)) {
        // удаляем лишние варианты и меняем ранги для остальных
        for (const optionValue of optionValues) {
          const index = value.indexOf(optionValue.content)
          if (index === -1) {
            await this.prismaService.optionValue.delete({ where: { id: optionValue.id } })
            continue
          }
          await this.prismaService.optionValue.update({
            where: { id: optionValue.id },
            data: { rank: index }
          })
          delete value[index]
        }
        // добавляем новые варианты
        for (const key in value) {
          await this.prismaService.optionValue.create({
            data: {
              option: { connect: { id: option.id } },
              product: { connect: { id: product?.id } },
              content: value[key],
              rank: Number(key)
            }
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
        await this.prismaService.optionValue.delete({ where: { id: optionValue.id } })
        return
      }

      if (isNumber(value)) {
        await this.prismaService.optionValue.update({
          where: { id: optionValue.id },
          data: { content: String(value) }
        })
        return
      }

      if (isBoolean(value)) {
        await this.prismaService.optionValue.update({
          where: { id: optionValue.id },
          data: { content: value ? '1' : '0' }
        })
        return
      }

      if (isString(value)) {
        await this.prismaService.optionValue.update({
          where: { id: optionValue.id },
          data: { content: value }
        })
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
    return await this.prismaService.offer.findMany({
      where: { product: { id: productId } },
      orderBy: {
        rank: 'asc'
      },
      include: { optionValues: true }
    })
  }

  async createOffer(productId: number, dto: CreateOfferDto) {
    const product = await this.productsRepository.findOneOrFail({ id: productId })

    const currentOffers = await this.offerRepository.find(
      { product },
      { populate: ['optionValues'] }
    )
    const existOffer = currentOffers.find(
      (currentOffer) =>
        JSON.stringify(pluck(currentOffer.optionValues.getItems(), 'id').sort()) ===
        JSON.stringify(dto.optionValues.sort())
    )
    if (existOffer) {
      throw new BadRequestException('Торговое предложение с указанными опциями уже сущесивует')
    }

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

  async removeOffer(id: number) {
    const offer = await this.offerRepository.findOneOrFail({ id })
    await this.offerRepository.getEntityManager().removeAndFlush(offer)
  }

  async updateOffer(id: number, dto: UpdateOfferDto) {
    const offer = await this.offerRepository.findOneOrFail({ id })

    const currentOffers = await this.offerRepository.find(
      { product: offer.product, id: { $ne: offer.id } },
      { populate: ['optionValues'] }
    )
    const existOffer = currentOffers.find(
      (currentOffer) =>
        JSON.stringify(pluck(currentOffer.optionValues.getItems(), 'id').sort()) ===
        JSON.stringify(dto.optionValues.sort())
    )
    if (existOffer) {
      throw new BadRequestException('Торговое предложение с указанными опциями уже сущесивует')
    }

    this.offerRepository.assign(offer, {
      price: dto.price,
      title: dto.title,
      optionValues: dto.optionValues
    })

    await this.offerRepository.getEntityManager().persistAndFlush(offer)
  }

  async import(upload: Express.Multer.File) {
    function getKeyByValue(object, value) {
      return Object.keys(object).find((key) => object[key] === value)
    }

    function swap(json) {
      var ret = {}
      for (var key in json) {
        ret[json[key]] = key
      }
      return ret
    }

    // const file = await this.storageService.upload(
    //   upload,
    //   join(`${nanoid()}-${upload.originalname}`)
    // )
    const decompress = require('decompress')
    const { XMLParser, XMLBuilder, XMLValidator } = require('fast-xml-parser')

    const parser = new XMLParser()

    try {
      const files = await decompress(upload.path)
      const productsFile = files.find((file) => file.path === 'import.xml')
      const offersFile = files.find((file) => file.path === 'offers.xml')
      const imageFiles = files.filter((file) => !['offers.xml', 'import.xml'].includes(file.path))
      const productsParsed = parser.parse(productsFile.data)
      const offersParsed = parser.parse(offersFile.data)

      const getUniqueProductAlias = async (alias: string, n: number = 0) => {
        const product = await this.productsRepository.findOne({ alias })
        if (!product) {
          return alias
        } else {
          return getUniqueProductAlias(`${alias}-${n}`, n + 1)
        }
      }

      const arrayField = (input: any) => {
        if (!Array.isArray(input)) {
          return [input]
        }
        return input
      }

      const parseCategories = async (): Promise<Record<string, Category>> => {
        const rqs = async (data: any, parent: Category | null) => {
          let output = {}
          for (const group of data) {
            let localCategory = await this.categoryRepository.findOne({
              remoteId: group['Ид']
            })
            if (!localCategory) {
              localCategory = new Category()
              localCategory.remoteId = group['Ид']
            }
            localCategory.title = group['Наименование']
            localCategory.alias = slugify(group['Наименование'])
            localCategory.active = true
            if (parent) {
              localCategory.parent = parent
              localCategory.alias = `${parent.alias}-${localCategory.alias}`
            }
            await this.categoryRepository.getEntityManager().persistAndFlush(localCategory)

            output[group['Ид']] = localCategory

            if (Array.isArray(group?.['Группы']?.['Группа'])) {
              output = {
                ...output,
                ...(await rqs(group['Группы']['Группа'], localCategory))
              }
            }
          }
          return output
        }
        return await rqs(
          productsParsed['КоммерческаяИнформация']['Классификатор']['Группы']['Группа'],
          null
        )
      }

      const parseProperties = async () => {
        const data =
          productsParsed['КоммерческаяИнформация']['Классификатор']['Свойства']['Свойство']
        let output = {}
        for (const item of data) {
          output[item['Ид']] = item['Наименование']
        }
        return output
      }

      const parsePropertyValues = async () => {
        const data =
          productsParsed['КоммерческаяИнформация']['Классификатор']['Свойства']['Свойство']
        let output = {}
        for (const item of data) {
          if (!item['ВариантыЗначений']) continue
          if (!item['ВариантыЗначений']['Справочник']) continue

          let values = item['ВариантыЗначений']['Справочник']
          if (typeof values === 'string') {
            values = [values]
          }
          for (const value of values) {
            output[value['ИдЗначения']] = value['Значение']
          }
        }
        return output
      }

      const parseBrands = async () => {
        const data =
          productsParsed['КоммерческаяИнформация']['Классификатор']['Свойства']['Свойство']
        let output = {}
        for (const itemProperty of data) {
          if (itemProperty['Наименование'] !== 'Бренд') continue

          for (const itemBrand of itemProperty['ВариантыЗначений']['Справочник']) {
            let brand = await this.brandRepository.findOne({
              remoteId: itemBrand['ИдЗначения']
            })
            if (!brand) {
              brand = new Brand()
              brand.remoteId = itemBrand['ИдЗначения']
            }
            brand.title = itemBrand['Значение']
            await this.brandRepository.getEntityManager().persistAndFlush(brand)

            output[itemBrand['ИдЗначения']] = brand
          }
        }
        return output
      }

      const createOptionsFromOffers = async (productOffers, product: Product) => {
        const output: Record<string, Option> = {}
        const tmp: Record<string, string[]> = {}
        for (const productOffer of productOffers) {
          if (productOffer['ХарактеристикиТовара']) {
            let rawProperties = productOffer['ХарактеристикиТовара']['ХарактеристикаТовара']
            if (!Array.isArray(rawProperties)) {
              rawProperties = [rawProperties]
            }
            for (const rawProperty of rawProperties) {
              if (!tmp[rawProperty['Наименование']]) {
                tmp[rawProperty['Наименование']] = []
              }
              tmp[rawProperty['Наименование']].push(rawProperty['Значение'])
            }
          }
        }

        // добавляем значения опций, присутствующие в выгрузке
        for (const [caption, strValues] of Object.entries(tmp)) {
          let option = await this.optionRepository.findOne({
            caption
          })
          if (!option) {
            option = new Option()
            option.caption = caption
            option.key = slugify(caption)
            option.rank = 2
            option.inFilter = true
            option.type = OptionType.COMBOOPTIONS
            await this.optionRepository.getEntityManager().persistAndFlush(option)
          }

          output[caption] = option

          // добавляем категории товара в категории опции
          await option.categories.init()
          for (const category of product.categories) {
            if (!option.categories.contains(category)) {
              option.categories.add(category)
            }
          }

          await option.values.init()
          for (const strValue of strValues) {
            // создаем значения опции товара, присутствующие в выгрузке
            let optionValue = await this.optionValueRepository.findOne({
              option,
              product,
              content: strValue
            })
            if (!optionValue) {
              optionValue = new OptionValue()
              optionValue.option = option
              optionValue.product = product
              optionValue.content = strValue
              await this.optionValueRepository.getEntityManager().persistAndFlush(optionValue)
            }
          }
        }

        // удаляем значения опций, отсутствующие в выгрузке
        for (const [caption, strValues] of Object.entries(tmp)) {
          const option = await this.optionRepository.findOne({ caption })

          if (!option) continue

          const optionValues = await this.optionValueRepository.find({
            option,
            product,
            content: {
              $nin: strValues
            }
          })
          await this.optionValueRepository.getEntityManager().removeAndFlush(optionValues)
        }

        return output
      }

      const parseProducts = async (limit: number) => {
        const data = productsParsed['КоммерческаяИнформация']['Каталог']['Товары']['Товар']
        let output: Record<string, Product> = {}
        let i = 0
        for (const itemProduct of data) {
          if (i === limit) break

          i++

          let product = await this.productsRepository.findOne({
            remoteId: itemProduct['Ид']
          })

          if (!product) {
            product = new Product()
            product.remoteId = itemProduct['Ид']
          }

          output[itemProduct['Ид']] = product

          product.sku = itemProduct['Артикул']
          const alias = slugify(itemProduct['Наименование'])
          product.alias = alias === product.alias ? alias : await getUniqueProductAlias(alias)
          product.title = itemProduct['Наименование']
          product.description = itemProduct['Описание']

          await this.productsRepository.getEntityManager().persistAndFlush(product)

          // удаляем все файлы, загружаем новые
          await product.images.init({ populate: ['file'] })
          for (const productImage of product.images) {
            await this.productImageRepository.getEntityManager().removeAndFlush(productImage)
            await this.storageService.remove(productImage.file.id)
          }
          if (itemProduct['Картинки']) {
            const itemProductImages = arrayField(itemProduct['Картинки']['Картинка'])
            for (const rawImagePath of itemProductImages) {
              if (!images[rawImagePath]) continue

              const file = await this.storageService.createFromBuffer(
                images[rawImagePath],
                join(String(product.id), rawImagePath)
              )
              const productImage = new ProductImage()
              productImage.file = file
              productImage.product = product
              productImage.rank = product.images.length
              this.productImageRepository.getEntityManager().persist(productImage)
            }
          }

          // отвязываем все категории и привязываем новые
          product.categories.removeAll()
          if (itemProduct['Группы']) {
            const itemProductGroups = arrayField(itemProduct['Группы']['Ид'])
            for (const rawCatId of itemProductGroups) {
              product.categories.add(categories[rawCatId])
            }
          }

          if (itemProduct['ЗначенияСвойств']) {
            for (const rawProperty of itemProduct['ЗначенияСвойств']['ЗначенияСвойства']) {
              if (rawProperty['Ид'] === propertiesByName['Бренд']) {
                product.brand = brands[rawProperty['Значение']]
              }
              if (rawProperty['Ид'] === propertiesByName['Новинки']) {
                product.recent = rawProperty['Значение'] === true
              }
              if (rawProperty['Ид'] === propertiesByName['ХитПродаж']) {
                product.favorite = rawProperty['Значение'] === true
              }
              if (rawProperty['Ид'] === propertiesByName['Цвет']) {
                let option = await this.optionRepository.findOne({ caption: 'Цвет' })
                if (!option) {
                  option = new Option()
                  option.caption = 'Цвет'
                  option.key = 'color'
                  option.rank = 0
                  option.inFilter = true
                  option.type = OptionType.COMBOCOLORS
                  await this.optionRepository.getEntityManager().persistAndFlush(option)
                }

                // добавляем категории товара в категории опции
                await option.categories.init()
                for (const category of product.categories) {
                  if (!option.categories.contains(category)) {
                    option.categories.add(category)
                  }
                }

                // добавляем значение опции если такого нет, остальные удаляем
                const productOptionValues = await this.optionValueRepository.find({
                  option,
                  product
                })
                if (rawProperty['Значение']) {
                  const orphanProductOptionValues = productOptionValues.filter(
                    (item) => item.content !== propertyValues[rawProperty['Значение']]
                  )
                  let productOptionValue = productOptionValues.find(
                    (item) => item.content === propertyValues[rawProperty['Значение']]
                  )
                  if (!productOptionValue) {
                    productOptionValue = new OptionValue()
                    productOptionValue.option = option
                    productOptionValue.product = product
                    productOptionValue.content = propertyValues[rawProperty['Значение']]
                    await this.optionValueRepository
                      .getEntityManager()
                      .persistAndFlush(productOptionValue)
                  }
                  await this.optionValueRepository
                    .getEntityManager()
                    .removeAndFlush(orphanProductOptionValues)
                } else {
                  await this.optionValueRepository
                    .getEntityManager()
                    .removeAndFlush(productOptionValues)
                }
              }
              if (rawProperty['Ид'] === propertiesByName['Материал']) {
                let option = await this.optionRepository.findOne({ caption: 'Материал' })
                if (!option) {
                  option = new Option()
                  option.caption = 'Материал'
                  option.key = 'material'
                  option.rank = 1
                  option.inFilter = true
                  option.type = OptionType.COMBOOPTIONS
                  await this.optionRepository.getEntityManager().persistAndFlush(option)
                }

                // добавляем категории товара в категории опции
                await option.categories.init()
                for (const category of product.categories) {
                  if (!option.categories.contains(category)) {
                    option.categories.add(category)
                  }
                }

                // добавляем значение опции если такого нет, остальные удаляем
                const productOptionValues = await this.optionValueRepository.find({
                  option,
                  product
                })
                if (rawProperty['Значение']) {
                  const orphanProductOptionValues = productOptionValues.filter(
                    (item) => item.content !== propertyValues[rawProperty['Значение']]
                  )
                  let productOptionValue = productOptionValues.find(
                    (item) => item.content === propertyValues[rawProperty['Значение']]
                  )
                  if (!productOptionValue) {
                    productOptionValue = new OptionValue()
                    productOptionValue.option = option
                    productOptionValue.product = product
                    productOptionValue.content = propertyValues[rawProperty['Значение']]
                    await this.optionValueRepository
                      .getEntityManager()
                      .persistAndFlush(productOptionValue)
                  }
                  await this.optionValueRepository
                    .getEntityManager()
                    .removeAndFlush(orphanProductOptionValues)
                } else {
                  await this.optionValueRepository
                    .getEntityManager()
                    .removeAndFlush(productOptionValues)
                }
              }
            }
          }

          // добавляем или обновляем торговые предложения присутствующие в выгрузке
          const productOffers = offersParsed['КоммерческаяИнформация']['ПакетПредложений'][
            'Предложения'
          ]['Предложение'].filter((item) => {
            return item['Ид'].split('#')[0] === itemProduct['Ид']
          })
          const productOfferIds = productOffers.map((item) => item['Ид'])

          const optionsFromOffers = await createOptionsFromOffers(productOffers, product)

          for (const item of productOffers) {
            if (!item?.['Цены']?.['Цена']?.['ЦенаЗаЕдиницу']) continue

            let offer = await this.offerRepository.findOne({ remoteId: item['Ид'] })
            if (!offer) {
              offer = new Offer()
              offer.remoteId = item['Ид']
            }
            offer.title = item['Наименование']
            offer.price = item['Цены']['Цена']['ЦенаЗаЕдиницу']
            offer.product = product
            await this.offerRepository.getEntityManager().persistAndFlush(offer)

            await offer.optionValues.init()
            offer.optionValues.removeAll()

            if (item['ХарактеристикиТовара']) {
              const rawProperties = arrayField(item['ХарактеристикиТовара']['ХарактеристикаТовара'])
              for (const rawProperty of rawProperties) {
                const option = optionsFromOffers[rawProperty['Наименование']]
                if (!option) continue

                const optionValue = await this.optionValueRepository.findOne({
                  product,
                  option,
                  content: rawProperty['Значение']
                })
                if (!optionValue) continue

                offer.optionValues.add(optionValue)
              }
            }
          }

          // удаляем торговые предложения, отсутствующие в выгрузке
          const orphanOffers = await this.offerRepository.find({
            remoteId: { $nin: productOfferIds },
            product
          })
          this.offerRepository.getEntityManager().remove(orphanOffers)

          await this.productsRepository.getEntityManager().flush()
        }
        return output
      }

      const parseImages = () => {
        const output = {}
        for (const imageFile of imageFiles) {
          output[imageFile['path']] = imageFile['data']
        }
        return output
      }

      const updateCategoryImage = async () => {
        for (const category of Object.values(categories)) {
          const firstProduct = await this.productsRepository.findOne(
            { categories: { $in: [category.id] } },
            {
              populate: ['images']
            }
          )
          if (firstProduct) {
            const image = firstProduct.images.getItems()[0]
            if (image) {
              category.image = image.file
            }
          }
        }
        await this.categoryRepository.getEntityManager().flush()
      }

      const updateCategoryActivity = async () => {
        for (const category of Object.values(categories)) {
          const productsCount = await this.productsRepository.count({
            categories: { $in: [category.id] }
          })
          if (productsCount === 0) {
            category.active = false
          } else if (category.title === 'Архив') {
            category.active = false
          } else {
            category.active = true
          }
        }
        await this.categoryRepository.getEntityManager().flush()
      }

      const includeParentsToProductCategories = async () => {
        for (const product of Object.values(products)) {
          for (const category of product.categories) {
            let tmp = category
            while (!!tmp.parent) {
              tmp = tmp.parent
              product.categories.add(tmp)
            }
          }
        }
        await this.productsRepository.getEntityManager().flush()
      }

      // Ид: Category
      const categories = await parseCategories()

      // Ид: Наименование
      const properties = await parseProperties()

      // Наименование: Ид
      const propertiesByName = swap(properties)

      // ИдЗначения: Значение
      const propertyValues = await parsePropertyValues()

      // Ид: Brand
      const brands = await parseBrands()

      // Path: Buffer
      const images = await parseImages()

      // Ид: Product
      const products = await parseProducts(2000)

      await updateCategoryImage()
      await includeParentsToProductCategories()
      await updateCategoryActivity()

      console.log('Extraction complete')
      return true
    } catch (err) {
      console.log(err)
      return err
    }
  }

  async orderByClick(id: number, dto: OrderByClickProductDto) {
    const product = await this.productsRepository.findOneOrFail(id)

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
