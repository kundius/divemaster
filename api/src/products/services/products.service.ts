import { nanoid, njk, pluck, slugify } from '@/lib/utils'
import { NotificationsService } from '@/notifications/services/notifications.service'
import { StorageService } from '@/storage/services/storage.service'
import { isArray, isBoolean, isNumber, isString, isUndefined } from '@modyqyw/utils'
import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { join } from 'path'
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
import { InjectRepository } from '@nestjs/typeorm'
import { Product } from '../entities/product.entity'
import {
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsWhere,
  In,
  Like,
  Not,
  Repository
} from 'typeorm'
import { Option, OptionType } from '../entities/option.entity'
import { Category } from '../entities/category.entity'
import { ProductsFilterService } from './products-filter.service'
import { ProductImage } from '../entities/product-image.entity'
import { OptionValue } from '../entities/option-value.entity'
import { Offer } from '../entities/offer.entity'
import { Brand } from '../entities/brand.entity'

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
        const product = await this.productRepository.findOneBy({ alias })
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
            const localAlias = slugify(group['Наименование'])

            let localCategory = await this.categoryRepository.findOne({
              where: { remoteId: group['Ид'] }
            })
            if (!localCategory) {
              localCategory = new Category()
              localCategory.remoteId = group['Ид']
            }
            localCategory.title = group['Наименование']
            localCategory.alias = parent ? `${parent.alias}-${localAlias}` : localAlias
            localCategory.active = true
            localCategory.parent = parent

            await this.categoryRepository.save(localCategory)

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

      const parseBrands = async (): Promise<{ [key: string]: Brand }> => {
        const data =
          productsParsed['КоммерческаяИнформация']['Классификатор']['Свойства']['Свойство']
        let output = {}
        for (const itemProperty of data) {
          if (itemProperty['Наименование'] !== 'Бренд') continue

          for (const itemBrand of itemProperty['ВариантыЗначений']['Справочник']) {
            let brand = await this.brandRepository.findOne({
              where: { remoteId: itemBrand['ИдЗначения'] }
            })
            if (!brand) {
              brand = new Brand()
              brand.remoteId = itemBrand['ИдЗначения']
            }
            brand.title = itemBrand['Значение']

            await this.brandRepository.save(brand)

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
            where: { caption }
          })
          if (!option) {
            option = new Option()
            option.caption = caption
          }
          option.key = slugify(caption)
          option.rank = 2
          option.inFilter = true
          option.type = OptionType.COMBOOPTIONS
          await this.optionRepository.save(option)

          output[caption] = option

          // добавляем категории товара в категории опции
          const productCategories = await this.categoryRepository.find({
            where: { products: { id: product.id } }
          })
          option.categories = productCategories
          await this.optionRepository.save(option)

          // TODO: переделать на upsert или параллельную обработку
          for (const strValue of strValues) {
            // создаем значения опции товара, присутствующие в выгрузке
            let optionValue = await this.optionValueRepository.findOne({
              where: {
                option: { id: option.id },
                product: { id: product.id },
                content: strValue
              }
            })
            if (!optionValue) {
              optionValue = new OptionValue()
              optionValue.option = option
              optionValue.product = product
              optionValue.content = strValue
            }
            await this.optionValueRepository.save(optionValue)
          }
        }

        // удаляем значения опций, отсутствующие в выгрузке
        for (const [caption, strValues] of Object.entries(tmp)) {
          const option = await this.optionRepository.findOne({ where: { caption } })

          if (!option) continue

          await this.optionValueRepository.delete({
            option: { id: option.id },
            product: { id: product.id },
            content: Not(In(strValues))
          })
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

          let product = await this.productRepository.findOne({
            where: { remoteId: itemProduct['Ид'] }
          })
          if (!product) {
            product = new Product()
            product.remoteId = itemProduct['Ид']
            product.alias = await getUniqueProductAlias(itemProduct['Наименование'])
          }
          product.sku = itemProduct['Артикул']
          product.title = itemProduct['Наименование']
          product.description = itemProduct['Описание']

          await this.productRepository.save(product)

          output[itemProduct['Ид']] = product

          // удаляем все файлы, загружаем новые
          const productImages = await this.productImageRepository.find({
            where: { productId: product.id },
            relations: { file: true }
          })
          for (const productImage of productImages) {
            await this.productImageRepository.delete({
              fileId: productImage.file.id,
              productId: product.id
            })
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
              productImage.rank = 0 // TODO: тут порядок не учитывает количество
              productImage.file = file
              productImage.product = product
              await this.productImageRepository.save(productImage)
            }
          }

          // отвязываем все категории и привязываем новые
          if (itemProduct['Группы']) {
            const itemProductGroups = arrayField(itemProduct['Группы']['Ид'])
            product.categories = await Promise.all(
              itemProductGroups.map(async (categoryId) =>
                this.categoryRepository.findOneByOrFail({ id: +categoryId })
              )
            )
            await this.productRepository.save(product)
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
                let option = await this.optionRepository.findOne({
                  where: { caption: 'Цвет' }
                })
                if (!option) {
                  option = new Option()
                  ;(option.caption = 'Цвет'),
                    (option.key = 'color'),
                    (option.rank = 0),
                    (option.inFilter = true),
                    (option.type = OptionType.COMBOCOLORS)
                  await this.optionRepository.save(option)
                }

                // добавляем категории товара в категории опции
                const productCategories = await this.categoryRepository.find({
                  where: { products: { id: product.id } }
                })
                option.categories = productCategories
                await this.optionRepository.save(option)

                // добавляем значение опции если такого нет, остальные удаляем
                const productOptionValues = await this.optionValueRepository.find({
                  where: {
                    option: { id: option.id },
                    product: { id: product.id }
                  }
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
                    productOptionValue.content = propertyValues[rawProperty['Значение']]
                    productOptionValue.product = product
                    productOptionValue.option = option
                    await this.optionValueRepository.save(productOptionValue)
                  }
                  await this.optionValueRepository.delete({
                    id: In(orphanProductOptionValues.map((item) => item.id))
                  })
                } else {
                  await this.optionValueRepository.delete({
                    id: In(productOptionValues.map((item) => item.id))
                  })
                }
              }
              if (rawProperty['Ид'] === propertiesByName['Материал']) {
                let option = await this.optionRepository.findOne({
                  where: { caption: 'Материал' }
                })
                if (!option) {
                  option = new Option()
                  option.caption = 'Материал'
                  option.key = 'material'
                  option.rank = 1
                  option.inFilter = true
                  option.type = OptionType.COMBOOPTIONS
                  await this.optionRepository.save(option)
                }

                // добавляем категории товара в категории опции
                const productCategories = await this.categoryRepository.find({
                  where: { products: { id: product.id } }
                })
                option.categories = productCategories
                await this.optionRepository.save(option)

                // добавляем значение опции если такого нет, остальные удаляем
                const productOptionValues = await this.optionValueRepository.find({
                  where: { option: { id: option.id }, product: { id: product.id } }
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
                    productOptionValue.content = propertyValues[rawProperty['Значение']]
                    productOptionValue.product = product
                    productOptionValue.option = option
                    await this.optionValueRepository.save(productOptionValue)
                  }
                  await this.optionValueRepository.delete({
                    id: In(orphanProductOptionValues.map((item) => item.id))
                  })
                } else {
                  await this.optionValueRepository.delete({
                    id: In(productOptionValues.map((item) => item.id))
                  })
                }
              }
            }
          }

          await this.productRepository.save(product)

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

            let offer = await this.offerRepository.findOne({
              where: { remoteId: item['Ид'] }
            })
            if (!offer) {
              offer = new Offer()
              offer.remoteId = item['Ид']
            }
            offer.title = item['Наименование']
            offer.price = item['Цены']['Цена']['ЦенаЗаЕдиницу']
            offer.product = product
            offer.optionValues = []

            await this.offerRepository.save(offer)

            if (item['ХарактеристикиТовара']) {
              const rawProperties = arrayField(item['ХарактеристикиТовара']['ХарактеристикаТовара'])
              for (const rawProperty of rawProperties) {
                const option = optionsFromOffers[rawProperty['Наименование']]

                if (!option) continue

                const optionValue = await this.optionValueRepository.findOne({
                  where: {
                    product: { id: product.id },
                    option: { id: option.id },
                    content: rawProperty['Значение']
                  }
                })

                if (!optionValue) continue

                offer.optionValues = [...offer.optionValues, optionValue]

                await this.offerRepository.save(offer)
              }
            }
          }

          // удаляем торговые предложения, отсутствующие в выгрузке
          await this.offerRepository.delete({
            remoteId: Not(In(productOfferIds)),
            product: { id: product.id }
          })
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
          const firstProduct = await this.productRepository.findOne({
            where: { categories: { id: category.id } },
            relations: { images: { file: true } }
          })
          if (firstProduct) {
            const image = firstProduct.images[0]
            if (image) {
              category.image = image.file
              await this.categoryRepository.save(category)
            }
          }
        }
      }

      const updateCategoryActivity = async () => {
        for (const category of Object.values(categories)) {
          const productsCount = await this.productRepository.count({
            where: { categories: { id: category.id } }
          })
          let active = true
          if (productsCount === 0) {
            active = false
          } else if (category.title === 'Архив') {
            active = false
          }
          category.active = active
          await this.categoryRepository.save(category)
        }
      }

      const includeParentsToProductCategories = async () => {
        // не уверен что понадобится, когда доработаем импорт
        // for (const product of Object.values(products)) {
        //   const productCategories = await this.prismaService.category.findMany({
        //     where: { products: { some: { product_id: product.id } } }
        //   })
        //   for (const productCategory of productCategories) {
        //     let tmp = productCategory
        //     while (!!tmp.parent_id) {
        //       tmp = tmp.parent_id
        //       product.categories.add(tmp)
        //     }
        //   }
        // }
        // await this.productsRepository.getEntityManager().flush()
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
