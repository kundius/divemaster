import type { EntityManager } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import { ProductFactory } from '../factories/ProductFactory'
import { Category } from '@/products/entities/category.entity'
import { slugify } from '@/lib/utils'

const categoryNames = [
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

export class ProductsSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const connection = em.getConnection()
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0;')
    await connection.execute('TRUNCATE TABLE `product`;')
    await connection.execute('TRUNCATE TABLE `category`;')
    await connection.execute('SET FOREIGN_KEY_CHECKS = 1;')

    const products = await new ProductFactory(em).create(100)
    const categories: Category[] = []

    for (const { name, children = [] } of categoryNames) {
      const parent = new Category()
      parent.title = name
      parent.alias = slugify(name)
      await em.persistAndFlush(parent)
      categories.push(parent)

      if (children.length > 0) {
        for (const { name } of children) {
          const child = new Category()
          child.title = name
          child.alias = slugify(`${parent.title}-${name}`)
          child.parent = parent
          await em.persistAndFlush(child)
          categories.push(child)
        }
      }
    }

    for (const product of products) {
      product.categories.add(categories.filter(() => Math.random() > 0.9))
      await em.persistAndFlush(product)
    }
  }
}
