import { slugify } from '@/lib/utils'
import { Category } from '@/products/entities/category.entity'
import { Product } from '@/products/entities/product.entity'
import { DataSource } from 'typeorm'
import { Seeder, SeederFactoryManager } from 'typeorm-extension'

const categories = [
  {
    name: 'Всё для подводной охоты',
    children: [
      { name: 'Гидрокостюмы' },
      { name: 'Ласты для подводной охоты' },
      { name: 'Ружья Пневматы' },
      { name: 'Маски' },
      { name: 'Трубки' },
      { name: 'Запчасти для ласт' },
      { name: 'Пояса и пряжки' },
      { name: 'Химия' },
      { name: 'Фонари' },
      { name: 'Сумки, чехлы, боксы' },
      { name: 'Слинги' },
      { name: 'Ремонт ружей пневматы' },
      { name: 'Перчатки' },
      { name: 'Носки' },
      { name: 'Ножи' },
      { name: 'Неопреновые аксессуары' },
      { name: 'Наконечники' },
      { name: 'Линь' },
      { name: 'Куканы' },
      { name: 'Катушки' },
      { name: 'Груза и грузовые системы' },
      { name: 'Гарпуны' },
      { name: 'Буи, буксировщики, плоты' },
      { name: 'Арбалеты' },
      { name: 'Ремонт арбалета' },
      { name: 'Акссесуары для фонарей' },
      { name: 'Аксессуары для ружей пневматы' },
      { name: 'Аксессуары для подводной охоты' },
      { name: 'Разгрузочные жилеты' },
      { name: 'Компьютеры для подводной охоты' },
      { name: 'Акссесуары для арбалета' },
      { name: 'Тяги для арбалета' }
    ]
  },
  {
    name: 'Всё для дайвинга',
    children: [
      { name: 'Шланги' },
      { name: 'Шлемы' },
      { name: 'Гидрокостюмы для дайвинга и сёрфинга' },
      { name: 'Ласты для дайвинга' },
      { name: 'Баллоны для дайвинга' },
      { name: 'Маски' },
      { name: 'Трубки' },
      { name: 'Компенсаторы' },
      { name: 'Приборы и компьютеры' },
      { name: 'Аксессуары для ласт' },
      { name: 'Аксессуары для дайвинга' },
      { name: 'Аксессуары для фото и видеосъёмки' },
      { name: 'Регуляторы и октопусы' },
      { name: 'Боты' },
      { name: 'Химия' },
      { name: 'Фонари' },
      { name: 'Сумки, чехлы, боксы' },
      { name: 'Пояса и пряжки' },
      { name: 'Перчатки' },
      { name: 'Носки' },
      { name: 'Ножи' },
      { name: 'Неопреновые аксессуары' },
      { name: 'Груза и грузовые системы' },
      { name: 'Буи, буксировщики, плоты' },
      { name: 'Аксессуары для фонарей' }
    ]
  },
  {
    name: 'Всё для плавания'
  }
]

export class ProductsSeeder implements Seeder {
  track = false

  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 0;')
    await dataSource.query('TRUNCATE TABLE `product`;')
    await dataSource.query('TRUNCATE TABLE `category`;')
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 1;')

    const categoryRepository = dataSource.getRepository(Category)
    const productRepository = dataSource.getRepository(Product)

    const productFactory = factoryManager.get(Product)
    const productEntities = await productFactory.saveMany(100)
    const categoryEntities: Category[] = []

    for (const { name, children = [] } of categories) {
      const parent = new Category()
      parent.title = name
      parent.alias = slugify(name)
      await categoryRepository.save(parent)
      categoryEntities.push(parent)

      if (children.length > 0) {
        for (const { name } of children) {
          const child = new Category()
          child.title = name
          child.alias = slugify(`${parent.title}-${name}`)
          child.parent = parent
          await categoryRepository.save(child)
          categoryEntities.push(child)
        }
      }
    }

    for (const productEntity of productEntities) {
      productEntity.categories = categoryEntities.filter(() => Math.random() > 0.8)
      await productRepository.save(productEntity)
    }
  }
}
