import { slugify } from '@/lib/utils'
import { Brand } from '@/products/entities/brand.entity'
import { Category } from '@/products/entities/category.entity'
import { Offer } from '@/products/entities/offer.entity'
// import { OptionValue } from '@/products/entities/option-value.entity'
import { Property, PropertyType } from '@/products/entities/property.entity'
import { ProductImage } from '@/products/entities/product-image.entity'
import { Product } from '@/products/entities/product.entity'
import { CategoriesService } from '@/products/services/categories.service'
import { ProductsService } from '@/products/services/products.service'
import { File } from '@/storage/entities/file.entity'
import { StorageService } from '@/storage/services/storage.service'
import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Cron, CronExpression } from '@nestjs/schedule'
import { InjectRepository } from '@nestjs/typeorm'
import * as AdmZip from 'adm-zip'
import { XMLParser } from 'fast-xml-parser'
import { mkdirSync, rmSync } from 'fs'
import { readFile } from 'fs/promises'
import { basename, join } from 'path'
import {
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsWhere,
  In,
  IsNull,
  Not,
  Repository
} from 'typeorm'
import { v4 as uuidv4 } from 'uuid'
import { FindAllSyncTaskDto } from '../dto/sync.dto'
import { SyncProduct } from '../entities/sync-product.entity'
import { SyncTask, SyncTaskStatus } from '../entities/sync-task.entity'
import { ProductOption } from '@/products/entities/product-option.entity'
import { OfferOption } from '@/products/entities/offer-option.entity'
import { isDeepEqual } from '@modyqyw/utils'

const swap = (json) => {
  var ret = {}
  for (var key in json) {
    ret[json[key]] = key
  }
  return ret
}

const arrayField = (input: any) => {
  if (!Array.isArray(input)) {
    return [input]
  }
  return input
}

const parsePriceTypes = (xml): Record<string, string> => {
  const data = xml['КоммерческаяИнформация']['ПакетПредложений']['ТипыЦен']['ТипЦены']
  const output = {}
  for (const item of data) {
    output[item['Ид']] = item['Наименование']
  }
  return output
}

const parseProperties = (xml): Record<string, string> => {
  const data = xml['КоммерческаяИнформация']['Классификатор']['Свойства']['Свойство']
  const output = {}
  for (const item of data) {
    output[item['Ид']] = item['Наименование']
  }
  return output
}

const parsePropertyValues = (xml): Record<string, string> => {
  const data = xml['КоммерческаяИнформация']['Классификатор']['Свойства']['Свойство']
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

const addOption = (target, name, value) => {
  if (target[name]) {
    if (!target[name].includes(value)) {
      target[name].push(value)
    }
  } else {
    target[name] = [value]
  }
}

@Injectable()
export class SyncService {
  constructor(
    @InjectRepository(SyncTask)
    private syncTaskRepository: Repository<SyncTask>,
    @InjectRepository(SyncProduct)
    private syncProductRepository: Repository<SyncProduct>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductOption)
    private productOptionRepository: Repository<ProductOption>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(ProductImage)
    private productImageRepository: Repository<ProductImage>,
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
    @InjectRepository(Property)
    private optionRepository: Repository<Property>,
    // @InjectRepository(OptionValue)
    // private optionValueRepository: Repository<OptionValue>,
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    @InjectRepository(OfferOption)
    private offerOptionRepository: Repository<OfferOption>,
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private storageService: StorageService,
    private configService: ConfigService
  ) {}

  takeProduct = 20

  async findAllTask(dto: FindAllSyncTaskDto) {
    const where: FindOptionsWhere<SyncTask> = {}
    const relations: FindOptionsRelations<SyncTask> = {}
    const order: FindOptionsOrder<SyncTask> = {}

    const [rows, total] = await this.syncTaskRepository.findAndCount({
      where,
      relations,
      order: {
        ...order,
        [dto.sort]: dto.dir
      },
      skip: dto.skip,
      take: dto.take
    })

    return { rows, total }
  }

  async removeTask(id: number) {
    return this.syncTaskRepository.delete({ id })
  }

  // распаковать архив, обновить задачу
  async createTask(upload: Express.Multer.File) {
    if (upload.mimetype !== 'application/zip') {
      throw new BadRequestException('Файл не является архивом')
    }

    const uuid = uuidv4()
    const syncDir = join(this.configService.get('LOCAL_STORAGE_PATH', ''), 'sync', uuid)

    mkdirSync(syncDir, { recursive: true })

    const zip = new AdmZip(upload.path)
    zip.extractAllTo(syncDir, true)

    const task = new SyncTask()
    task.uuid = uuid
    task.status = SyncTaskStatus.INITIALIZATION
    task.statusMessage = 'Архив загружен'

    await this.syncTaskRepository.save(task)

    return task
  }

  // данные из файлов перенести в промежуточную базу
  @Cron(CronExpression.EVERY_SECOND)
  async prepareTask() {
    const tasks = await this.syncTaskRepository.find({
      where: { status: SyncTaskStatus.INITIALIZATION }
    })

    for (const task of tasks) {
      const syncDir = join(this.configService.get('LOCAL_STORAGE_PATH', ''), 'sync', task.uuid)

      let importContent = ''
      let offersContent = ''

      try {
        importContent = await readFile(join(syncDir, 'import.xml'), 'utf-8')
        offersContent = await readFile(join(syncDir, 'offers.xml'), 'utf-8')
      } catch (e) {
        task.status = SyncTaskStatus.ERROR
        task.statusMessage = `Не найден один из необходимых файлов: import.xml, offers.xml`
        await this.syncTaskRepository.save(task)
        continue
      }

      const dataTo: Record<string, string | null | number>[] = []

      try {
        const parser = new XMLParser()
        const importData = parser.parse(importContent)
        const offersData = parser.parse(offersContent)

        const priceTypesById = parsePriceTypes(offersData)
        const optionsById = parseProperties(importData)
        const optionsByName = swap(optionsById)
        const optionValuesById = parsePropertyValues(importData)

        for (const rawProduct of importData['КоммерческаяИнформация']['Каталог']['Товары'][
          'Товар'
        ]) {
          const product: Record<string, string | null | number> = {
            remoteId: rawProduct['Ид'] || '',
            sku: rawProduct['Артикул'] || '',
            name: rawProduct['Наименование'] || '',
            description: rawProduct['Описание'] || '',
            brand: '',
            categories: '',
            images: '',
            offers: '',
            options: '',
            syncTaskId: task.id
          }

          // парсим категории в виде ['Раздел', 'Подраздел']
          let categories: string[][] = []
          if (rawProduct['Группы'] && rawProduct['Группы']['Ид']) {
            const groupIds = arrayField(rawProduct['Группы']['Ид'])
            for (const groupId of groupIds) {
              const fn = (items: Record<string, any>[], path: string[]): string[] | undefined => {
                const found = items.find((item) => item['Ид'] === groupId)
                if (found) {
                  return [...path, found['Наименование']]
                }
                for (const item of items) {
                  if (item['Группы'] && item['Группы']['Группа']) {
                    const _found = fn(item['Группы']['Группа'], [...path, item['Наименование']])
                    if (_found) {
                      return _found
                    }
                  }
                }
                return undefined
              }

              const group = fn(
                importData['КоммерческаяИнформация']['Классификатор']['Группы']['Группа'],
                []
              )

              if (group) {
                categories.push(group)
              }
            }
          }
          product.categories = JSON.stringify(categories)

          // Пропусить, если среди категорий есть архив
          if (categories.find((path) => path[0] === 'Архив')) {
            continue
          }

          let images: string[] = []
          if (rawProduct['Картинки'] && rawProduct['Картинки']['Картинка']) {
            const rawImages = arrayField(rawProduct['Картинки']['Картинка'])
            for (const rawImage of rawImages) {
              images.push(join('sync', task.uuid, rawImage))
            }
          }
          product.images = JSON.stringify(images)

          let options: Record<string, string[]> = {}
          if (rawProduct['ЗначенияСвойств'] && rawProduct['ЗначенияСвойств']['ЗначенияСвойства']) {
            const rawOptions = arrayField(rawProduct['ЗначенияСвойств']['ЗначенияСвойства'])
            for (const rawOption of rawOptions) {
              // у "Новинки" и "ХитПродаж" всегда пустое "Значение", проверить факт наличия
              if (rawOption['Ид'] === optionsByName['Новинки']) {
                product.recent = rawOption['Значение'] ? '1' : '0'
              }
              if (rawOption['Ид'] === optionsByName['ХитПродаж']) {
                product.favorite = rawOption['Значение'] ? '1' : '0'
              }
              // у "Бренд", "Цвет" и "Материал" может быть пустое "Значение", проверить что оно не пустое
              if (rawOption['Ид'] === optionsByName['Бренд']) {
                if (rawOption['Значение']) {
                  product.brand = optionValuesById[rawOption['Значение']]
                }
              }
              if (rawOption['Ид'] === optionsByName['Цвет']) {
                if (rawOption['Значение']) {
                  addOption(options, 'Цвет', optionValuesById[rawOption['Значение']])
                }
              }
              if (rawOption['Ид'] === optionsByName['Материал']) {
                if (rawOption['Значение']) {
                  addOption(options, 'Материал', optionValuesById[rawOption['Значение']])
                }
              }
            }
          }

          let offers: Record<string, any> = []
          const rawOffers =
            offersData['КоммерческаяИнформация']['ПакетПредложений']['Предложения']['Предложение']
          for (const rawOffer of rawOffers) {
            const rawOfferId = rawOffer['Ид']
            const rawOfferProductId = rawOfferId.split('#')[0]

            // пропустить офферы других товаров
            if (rawOfferProductId !== rawProduct['Ид']) {
              continue
            }

            let offerPrice: number | undefined = undefined
            if (rawOffer['Цены']) {
              const rawOfferPrices = arrayField(rawOffer['Цены']['Цена'])
              for (const rawOfferPrice of rawOfferPrices) {
                if ((priceTypesById[rawOfferPrice['ИдТипаЦены']] = 'Розничная')) {
                  offerPrice = rawOfferPrice['ЦенаЗаЕдиницу']
                }
              }
            }

            // не добавлять оффер если розничная цена не найдена
            if (typeof offerPrice === 'undefined') {
              continue
            }

            const offer = {
              price: offerPrice,
              remoteId: rawOfferId,
              name: rawOffer['Наименование'],
              options: {}
            }

            if (rawOffer['ХарактеристикиТовара']) {
              const rawOfferOptions = arrayField(
                rawOffer['ХарактеристикиТовара']['ХарактеристикаТовара']
              )
              for (const rawOfferOption of rawOfferOptions) {
                offer.options[rawOfferOption['Наименование']] = rawOfferOption['Значение']
                addOption(options, rawOfferOption['Наименование'], rawOfferOption['Значение'])
              }
            }

            offers.push(offer)
          }

          // поскольку опции находятся и в товаре и в оффере, добавить их после всего
          product.offers = JSON.stringify(offers)
          product.options = JSON.stringify(options)

          dataTo.push(product)
        }
      } catch (e) {
        task.status = SyncTaskStatus.ERROR
        task.statusMessage = `Не удалось прочитать данные, ошибка: ${e.message}`
        await this.syncTaskRepository.save(task)
        continue
      }

      try {
        await this.syncProductRepository.createQueryBuilder().insert().values(dataTo).execute()

        task.status = SyncTaskStatus.SYNCHRONIZATION
        task.statusMessage = `Синхронизация товаров`
        task.total = dataTo.length
        await this.syncTaskRepository.save(task)
      } catch (e) {
        task.status = SyncTaskStatus.ERROR
        task.statusMessage = `Не удалось подготовить товары к синхронизации. Ошибка: ${e.message}`
        await this.syncTaskRepository.save(task)
      }
    }
  }

  // TODO: реализовать подсчет количества добавленных, обновленных и пропущенных товаров
  // обновить товары данными из промежуточной таблицы
  @Cron(CronExpression.EVERY_SECOND)
  async syncTask() {
    const task = await this.syncTaskRepository.findOne({
      where: { status: SyncTaskStatus.SYNCHRONIZATION }
    })

    if (!task || task.busy) return

    // сделать таску занятой чтобы не выполнять паралельного импорта
    task.busy = true
    await this.syncTaskRepository.save(task)

    const products = await this.syncProductRepository.find({
      where: { syncTaskId: task.id },
      take: this.takeProduct,
      skip: task.offset
    })

    for (const data of products) {
      let product = await this.productRepository.findOne({
        where: { remoteId: data.remoteId },
        relations: { offers: { options: true } }
      })

      // Если товара нет создать новый.
      // Новый товар заполнить имеющимися данными.
      if (!product) {
        product = new Product()
        product.remoteId = data.remoteId
        product.alias = await this.productsService.makeAlias(data.name, true)
        product.sku = data.sku
        product.title = data.name
        product.description = data.description
        product.recent = data.recent === '1'
        product.favorite = data.favorite === '1'

        // дальше понадобится id товара, сохранить
        await this.productRepository.save(product)

        // связать с существующим или новым брендом
        if (data.brand) {
          let brand = await this.brandRepository.findOneBy({ title: data.brand })
          if (!brand) {
            brand = new Brand()
            brand.title = data.brand
          }
          product.brand = brand
        }

        // загрузить и привязать картинки, запомнить первую для добавления категории
        let categoryImage: File | null = null
        let images: string[] = []
        try {
          images = JSON.parse(data.images) as unknown as typeof images
        } catch {}
        let rank = 0
        for (const image of images) {
          // если по какой-то причине картинка не добавляется- пропускаем
          try {
            rank++
            const filePath = join(String(product.id), basename(image))
            const file = await this.storageService.createFromPath(image, filePath)
            const productImage = new ProductImage()
            productImage.rank = rank
            productImage.file = file
            productImage.product = product
            await this.productImageRepository.save(productImage)
            if (!categoryImage) {
              categoryImage = file
            }
          } catch {}
        }

        // Связать с существующими или новыми категориями.
        // Существующие категории выбрать с учетом вложенности.
        // Все уровни вложенности присвоить товару.
        // Алиас построить с учетом всех родителей.
        let categoriesData: string[][] = []
        const categories: Category[] = []
        try {
          categoriesData = JSON.parse(data.categories) as unknown as typeof categoriesData
        } catch {}
        for (const categoryChain of categoriesData) {
          const parents: Category[] = []
          for (const categoryName of categoryChain) {
            // категорию ищем с учетом всех родителей
            const where: FindOptionsWhere<Category> = { title: categoryName }
            const fn = (q: typeof where, p: typeof parents) => {
              const newArray = [...p]
              const last = newArray.pop()
              if (last) {
                q.parent = { title: last.title }
                fn(q.parent, newArray)
              }
            }
            fn(where, parents)
            let category = await this.categoryRepository.findOneBy(where)
            if (!category) {
              category = new Category()
              category.title = categoryName
              category.alias = await this.categoriesService.makeAlias(
                [...parents.map((item) => item.alias), categoryName].join('-'),
                true
              )
              category.image = categoryImage
              category.parent = parents[parents.length - 1]
              await this.categoryRepository.save(category)
            }
            parents.push(category)
            categories.push(category)
          }
        }
        product.categories = categories

        await this.productRepository.save(product)
      }

      // Связать с существующими или новыми опциями и их значениями.
      // Опции искать по ключу _или_ названию, чтобы гарантировать уникальность ключа.
      // Только добавляем новые, существующие не меняем.
      let options: Record<string, string[]> = {}
      try {
        options = JSON.parse(data.options) as unknown as typeof options
      } catch {}
      let i = 0
      for (const [caption, values] of Object.entries(options)) {
        i++
        const key = slugify(caption)
        let option = await this.optionRepository.findOneBy([{ caption }, { key }])
        if (!option) {
          option = new Property()
          option.caption = caption
          option.key = key
          option.rank = i
          option.inFilter = true
          option.type = PropertyType.COMBOOPTIONS
          await this.optionRepository.save(option)
        }
        let k = 0
        for (const content of values) {
          k++
          let optionValue = await this.productOptionRepository.findOneBy({
            productId: product.id,
            name: option.key,
            content
          })
          if (!optionValue) {
            optionValue = this.productOptionRepository.create({
              productId: product.id,
              name: option.key,
              content,
              rank: k
            })
            await this.productOptionRepository.save(optionValue)
          }
        }
      }

      // Все опции и их значения добавлены, можно обновлять торговые предложения.
      // 1) Найти торговое предложение с указанными значениями опций
      // 2) Если найдено обновить цену и прописать remoteId
      // 3) Если не найдено добавить новое
      // 4) Удалить все торговые предложения товара, которых нет в выгрузке и у которых есть remoteId
      //
      // в п.4 проверка remoteId необходима, чтобы не удалить торг. предл. добавленные через админку вручную
      // при этом в случае сходства параметров вручную добавленные обновятся и приобретут remoteId
      const changedOfferIds: number[] = []
      let offers: {
        price: number
        remoteId: string
        name: string
        options: Record<string, string>
      }[] = []
      try {
        offers = JSON.parse(data.offers) as unknown as typeof offers
      } catch {}
      let ii = 0
      for (const offerData of offers) {
        ii++
        const optionEntries = Object.entries(offerData.options)
        // const optionValues = Object.entries(offerData.options).map(
        //   ([caption, content]) => optionValuesForOffers[caption][content]
        // )
        // const optionValueIds = optionValues.map((optionValue) => optionValue.id)
        // const qb = this.offerRepository
        //   .createQueryBuilder('offer')
        //   .leftJoinAndSelect('offer.product', 'product')
        //   .leftJoinAndSelect('offer.optionValues', 'optionValues')
        //   .setParameter('optionValueIds', optionValueIds)
        //   .setParameter('optionValueCount', optionValueIds.length)
        // qb.where('product.id = :productId', { productId: product.id })
        // if (optionValueIds.length > 0) {
        //   qb.andWhere((qb) => {
        //     const subQuery = qb
        //       .subQuery()
        //       .select('1')
        //       .from(OptionValue, 'v')
        //       .innerJoin('v.offers', 'o')
        //       .where('o.id = offer.id')
        //       .andWhere('v.id IN (:...optionValueIds)')
        //     return `EXISTS ${subQuery.getQuery()}`
        //   })
        // }
        // qb.groupBy('offer.id')
        // qb.having('COUNT(optionValues.id) = :optionValueCount')

        // let offer = await qb.getOne()
        let offer = product.offers.find((productOffer) => {
          const a1 = productOffer.options
            .map((option) => [option.name, option.content])
            .sort((a, b) => a[0].localeCompare(b[0]))
          const a2 = optionEntries.sort((a, b) => a[0].localeCompare(b[0]))
          return isDeepEqual(a1, a2)
        })

        if (!offer) {
          offer = this.offerRepository.create({
            product: product,
            rank: ii,
            title: offerData.name
          })
        }

        offer.remoteId = offerData.remoteId // для обновления добавленных вручную офферов
        offer.price = offerData.price

        await this.offerRepository.save(offer)

        // удалить старые опции оффера
        await this.offerOptionRepository.delete({ offer })

        // добваить новые опции оффера
        for (const [name, content] of optionEntries) {
          const offerOption = this.offerOptionRepository.create({
            name,
            content,
            offer
          })
          await this.offerOptionRepository.save(offerOption)
        }

        changedOfferIds.push(offer.id)
      }
      // Удалить торг. предл. ранеее загруженные из выгрузки и теперь в ней отсутствующие
      await this.offerRepository.delete({
        remoteId: Not(IsNull()),
        id: Not(In(changedOfferIds)),
        productId: product.id
      })
    }

    // добавить смещение ограниченное общим количеством
    task.offset = Math.min(task.offset + this.takeProduct, task.total)

    // сделать таску готовой к работе
    task.busy = false

    // если это были последние товары, то выполнить завершающие действия
    if (task.offset === task.total) {
      // удалить товары, которых нет в выгрузке и которые не были добавлены вручную
      const rawProducts = await this.productRepository
        .createQueryBuilder('product')
        .select('id')
        .where('product.remoteId IS NOT NULL')
        .andWhere((qb) => {
          const subQuery = qb
            .subQuery()
            .select('1')
            .from(SyncProduct, 'p')
            .andWhere('p.remoteId = product.remoteId')
          return `NOT EXISTS ${subQuery.getQuery()}`
        })
        .getRawMany()
      await this.productRepository.delete({ id: In(rawProducts.map((item) => item.id)) })

      // удалить файлы
      const syncDir = join(this.configService.get('LOCAL_STORAGE_PATH', ''), 'sync', task.uuid)
      rmSync(syncDir, { recursive: true, force: true })

      // удалить товары задачи
      await this.syncProductRepository.delete({ syncTaskId: task.id })

      task.status = SyncTaskStatus.SUCCESS
    }

    // сохранить задачу в самом конце чтобы она не пошла в следующую итерацию раньше времени
    await this.syncTaskRepository.save(task)
  }
}
