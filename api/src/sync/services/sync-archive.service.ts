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
      where: { status: SyncTaskStatus.INITIALIZATION }
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

        const parseProperties = async () => {
          const data = importData['КоммерческаяИнформация']['Классификатор']['Свойства']['Свойство']
          let output = {}
          for (const item of data) {
            output[item['Ид']] = item['Наименование']
          }
          return output
        }

        const parseCategories = async () => {
          const data = importData['КоммерческаяИнформация']['Классификатор']['Группы']['Группа']
          let output = {}
          for (const item of data) {
            output[item['Ид']] = item['Наименование']
          }
          return output
        }

        // Ид: Наименование
        const parsedProperties = await parseProperties()

        // Наименование: Ид
        const parsedPropertiesByName = swap(parsedProperties)

        const parsedCategories = await parseCategories()

        const dataTo: Record<string, string>[] = []
        const dataFrom = importData['КоммерческаяИнформация']['Каталог']['Товары']['Товар']
        for (const rowFrom of dataFrom) {
          let images: string[] = []
          if (Array.isArray(rowFrom['Картинки']['Картинка'])) {
            images = rowFrom['Картинки']['Картинка']
          }
          if (typeof rowFrom['Картинки']['Картинка'] === 'string') {
            images = [rowFrom['Картинки']['Картинка']]
          }

          let categories: string[][] = []
          if (rowFrom['Группы']) {
            const groupIds = Array.isArray(rowFrom['Группы']['Ид'])
              ? rowFrom['Группы']['Ид']
              : [rowFrom['Группы']['Ид']]
            for (const groupId of groupIds) {
              const fn = (items: Record<string, any>[], path: string[]): string[] | undefined => {
                const found = items.find(item => item['Ид'] === groupId)
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

              const group = fn(importData['КоммерческаяИнформация']['Классификатор']['Группы']['Группа'], [])

              if (group) {
                categories.push(group)
              }
            }
          }
          
          // Пропусить, если среди категорий есть архивная
          if (categories.find(path => path[0] === 'Архив')) {
            continue
          }

          const rowTo: Record<string, string> = {}
          rowTo.remoteId = rowFrom['Ид']
          rowTo.article = rowFrom['Артикул']
          rowTo.name = rowFrom['Наименование']
          rowTo.description = rowFrom['Описание']
          rowTo.images = JSON.stringify(images)
          rowTo.categories = JSON.stringify(categories)
          dataTo.push(rowTo)
        }
        console.log(dataTo)
        // await this.syncProductRepository
        //   .createQueryBuilder()
        //   .insert()
        //   .values([
        //     { firstName: 'Timber', lastName: 'Saw' },
        //     { firstName: 'Phantom', lastName: 'Lancer' }
        //   ])
        //   .execute()
      }
    }
  }
}
