import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SyncTask, SyncTaskProvider, SyncTaskStatus } from '../entities/sync-task.entity'
import { SyncProduct } from '../entities/sync-product.entity'
import { Cron, CronExpression } from '@nestjs/schedule'
import { copyFileSync, existsSync, mkdirSync } from 'fs'
import { readFile } from 'fs/promises'
import { v4 as uuidv4 } from 'uuid'
import { extname, join } from 'path'
import * as AdmZip from 'adm-zip'
import { XMLParser, XMLBuilder, XMLValidator } from 'fast-xml-parser'

function swap(json) {
  var ret = {}
  for (var key in json) {
    ret[json[key]] = key
  }
  return ret
}

@Injectable()
export class SyncArchiveService {
  constructor(
    @InjectRepository(SyncTask)
    private syncTaskRepository: Repository<SyncTask>,
    @InjectRepository(SyncProduct)
    private syncProductRepository: Repository<SyncProduct>
  ) {}

  async createTask(upload: Express.Multer.File) {
    const randomName = uuidv4()
    const syncDir = join('uploads', 'sync')
    const archiveDir = join(syncDir, randomName)
    const filePath = join(syncDir, `${randomName}${extname(upload.originalname)}`)

    mkdirSync(archiveDir, { recursive: true })
    copyFileSync(upload.path, filePath)

    const task = new SyncTask()
    task.provider = SyncTaskProvider.ARCHIVE
    task.status = SyncTaskStatus.INITIALIZATION
    task.statusMessage = 'Архив загружен'
    task.properties = {
      stage: 'created',
      filePath,
      archiveDir
    }

    if (upload.mimetype !== 'application/zip') {
      task.status = SyncTaskStatus.ERROR
      task.statusMessage = 'Загруженный файл не является архивом.'
    }

    await this.syncTaskRepository.save(task)

    return task
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async prepareTask() {
    const tasks = await this.syncTaskRepository.find({
      where: { status: SyncTaskStatus.INITIALIZATION, provider: SyncTaskProvider.ARCHIVE }
    })

    for (const task of tasks) {
      const properties = task.properties || {}

      if (!properties.stage) {
        task.status = SyncTaskStatus.ERROR
        task.statusMessage = 'Непредвиденная ошибка. Не указан этап.'
        await this.syncTaskRepository.save(task)
        continue
      }

      if (properties.stage === 'created') {
        console.log('SyncArchiveService created')
        const filePath = properties.filePath
        const archiveDir = properties.archiveDir

        if (!archiveDir || !filePath) {
          task.status = SyncTaskStatus.ERROR
          task.statusMessage = 'Файл не найден.'
          await this.syncTaskRepository.save(task)
          continue
        }

        try {
          const zip = new AdmZip(filePath)
          zip.extractAllTo(archiveDir, true)
          task.properties = { ...properties, stage: 'unpacked' }
          task.statusMessage = `Архив распакован`
          await this.syncTaskRepository.save(task)
          continue
        } catch (e) {
          task.status = SyncTaskStatus.ERROR
          task.statusMessage = `При распаковке архива возникла ошибка: ${e.message}`
          await this.syncTaskRepository.save(task)
          continue
        }
      }

      if (properties.stage === 'unpacked') {
        let importContent = ''
        let offersContent = ''

        try {
          importContent = await readFile(join(properties.archiveDir, 'import.xml'), 'utf-8')
          offersContent = await readFile(join(properties.archiveDir, 'offers.xml'), 'utf-8')
        } catch (e) {
          task.status = SyncTaskStatus.ERROR
          task.statusMessage = `В архиве нет одного из необходимых файлов: import.xml, offers.xml`
          await this.syncTaskRepository.save(task)
          continue
        }

        const parser = new XMLParser()
        const importData = parser.parse(importContent)
        const offersData = parser.parse(offersContent)

        const arrayField = (input: any) => {
          if (!Array.isArray(input)) {
            return [input]
          }
          return input
        }

        const parsePriceTypes = (): Record<string, string> => {
          const data =
            offersData['КоммерческаяИнформация']['ПакетПредложений']['ТипыЦен']['ТипЦены']
          let output = {}
          for (const item of data) {
            output[item['Ид']] = item['Наименование']
          }
          return output
        }

        const parseProperties = (): Record<string, string> => {
          const data = importData['КоммерческаяИнформация']['Классификатор']['Свойства']['Свойство']
          let output = {}
          for (const item of data) {
            output[item['Ид']] = item['Наименование']
          }
          return output
        }

        const parsePropertyValues = (): Record<string, string> => {
          const data = importData['КоммерческаяИнформация']['Классификатор']['Свойства']['Свойство']
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

        const priceTypesById = parsePriceTypes()
        const optionsById = parseProperties()
        const optionsByName = swap(optionsById)
        const optionValuesById = parsePropertyValues()

        const dataTo: Record<string, string | null | number>[] = []
        const dataFrom = importData['КоммерческаяИнформация']['Каталог']['Товары']['Товар']

        for (const rowFrom of dataFrom) {
          const rowTo: Record<string, string | null | number> = {
            remoteId: rowFrom['Ид'],
            sku: rowFrom['Артикул'],
            name: rowFrom['Наименование'],
            description: rowFrom['Описание'],
            brand: null,
            categories: null,
            images: null,
            offers: null,
            options: null,
            syncTaskId: task.id
          }

          // парсим категории в виде ['Раздел', 'Подраздел']
          let categories: string[][] = []
          if (rowFrom['Группы'] && rowFrom['Группы']['Ид']) {
            const groupIds = arrayField(rowFrom['Группы']['Ид'])
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
          rowTo.categories = JSON.stringify(categories)

          // Пропусить, если среди категорий есть архив
          if (categories.find((path) => path[0] === 'Архив')) {
            continue
          }

          let images: string[] = []
          if (rowFrom['Картинки'] && rowFrom['Картинки']['Картинка']) {
            images = arrayField(rowFrom['Картинки']['Картинка'])
          }
          rowTo.images = JSON.stringify(images)

          let options: Record<string, string[]> = {}
          if (rowFrom['ЗначенияСвойств'] && rowFrom['ЗначенияСвойств']['ЗначенияСвойства']) {
            const rawOptions = arrayField(rowFrom['ЗначенияСвойств']['ЗначенияСвойства'])
            for (const rawOption of rawOptions) {
              // у "Новинки" и "ХитПродаж" всегда пустое "Значение", проверить факт наличия
              if (rawOption['Ид'] === optionsByName['Новинки']) {
                rowTo.recent = rawOption['Значение'] ? '1' : '0'
              }
              if (rawOption['Ид'] === optionsByName['ХитПродаж']) {
                rowTo.favorite = rawOption['Значение'] ? '1' : '0'
              }
              // у "Бренд", "Цвет" и "Материал" может быть пустое "Значение", проверить что оно не пустое
              if (rawOption['Ид'] === optionsByName['Бренд']) {
                if (rawOption['Значение']) {
                  rowTo.brand = optionValuesById[rawOption['Значение']]
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
            if (rawOfferProductId !== rowFrom['Ид']) {
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
                addOption(options, rawOfferOption['Наименование'], rawOfferOption['Значение'])
                addOption(offer.options, rawOfferOption['Наименование'], rawOfferOption['Значение'])
              }
            }

            offers.push(offer)
          }

          // поскольку опции находятся и в товаре и в оффере, добавить их после всего
          rowTo.offers = JSON.stringify(offers)
          rowTo.options = JSON.stringify(options)

          dataTo.push(rowTo)
        }

        // если запись в базу сломается то... перехватим исключение и поменяем статус на ошибку

        console.log(
          await this.syncProductRepository.createQueryBuilder().insert().values(dataTo).execute()
        )

        task.status = SyncTaskStatus.SYNCHRONIZATION
        task.statusMessage = `Синхронизация товаров`
        task.total = dataTo.length
        await this.syncTaskRepository.save(task)
      }
    }
  }
}
