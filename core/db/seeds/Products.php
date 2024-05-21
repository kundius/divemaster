<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductCategory;
use Phinx\Seed\AbstractSeed;
use Vesp\Services\Eloquent;

class Products extends AbstractSeed
{
  // Количество генерируемых категорий
  protected $categories = [
    [
      'name' => 'Всё для подводной охоты',
      'children' => [
        ['name' => 'Гидрокостюмы'],
        ['name' => 'Ласты для подводной охоты'],
        ['name' => 'Ружья Пневматы'],
        ['name' => 'Маски'],
        ['name' => 'Трубки'],
        ['name' => 'Запчасти для ласт'],
        ['name' => 'Пояса и пряжки'],
        ['name' => 'Химия'],
        ['name' => 'Фонари'],
        ['name' => 'Сумки, чехлы, боксы'],
        ['name' => 'Слинги'],
        ['name' => 'Ремонт ружей пневматы'],
        ['name' => 'Перчатки'],
        ['name' => 'Носки'],
        ['name' => 'Ножи'],
        ['name' => 'Неопреновые аксессуары'],
        ['name' => 'Наконечники'],
        ['name' => 'Линь'],
        ['name' => 'Куканы'],
        ['name' => 'Катушки'],
        ['name' => 'Груза и грузовые системы'],
        ['name' => 'Гарпуны'],
        ['name' => 'Буи, буксировщики, плоты'],
        ['name' => 'Арбалеты'],
        ['name' => 'Ремонт арбалета'],
        ['name' => 'Акссесуары для фонарей'],
        ['name' => 'Аксессуары для ружей пневматы'],
        ['name' => 'Аксессуары для подводной охоты'],
        ['name' => 'Разгрузочные жилеты'],
        ['name' => 'Компьютеры для подводной охоты'],
        ['name' => 'Акссесуары для арбалета'],
        ['name' => 'Тяги для арбалета'],
      ]
    ],
    [
      'name' => 'Всё для дайвинга',
      'children' => [
        ['name' => 'Шланги'],
        ['name' => 'Шлемы'],
        ['name' => 'Гидрокостюмы для дайвинга и сёрфинга'],
        ['name' => 'Ласты для дайвинга'],
        ['name' => 'Баллоны для дайвинга'],
        ['name' => 'Маски'],
        ['name' => 'Трубки'],
        ['name' => 'Компенсаторы'],
        ['name' => 'Приборы и компьютеры'],
        ['name' => 'Аксессуары для ласт'],
        ['name' => 'Аксессуары для дайвинга'],
        ['name' => 'Аксессуары для фото и видеосъёмки'],
        ['name' => 'Регуляторы и октопусы'],
        ['name' => 'Боты'],
        ['name' => 'Химия'],
        ['name' => 'Фонари'],
        ['name' => 'Сумки, чехлы, боксы'],
        ['name' => 'Пояса и пряжки'],
        ['name' => 'Перчатки'],
        ['name' => 'Носки'],
        ['name' => 'Ножи'],
        ['name' => 'Неопреновые аксессуары'],
        ['name' => 'Груза и грузовые системы'],
        ['name' => 'Буи, буксировщики, плоты'],
        ['name' => 'Аксессуары для фонарей'],
      ]
    ],
    [
      'name' => 'Всё для плавания'
    ]
  ];
  // И товаров
  protected $products = 1000;

  public function slugify($text)
  {
    // replace non letter or digits by -
    $text = preg_replace('~[^\\pL\d]+~u', '-', $text);
  
    // trim
    $text = trim($text, '-');
  
    // transliterate
    if (extension_loaded('intl')) {
      $translit = Transliterator::create('Any-Latin; Latin-ASCII');
      $text = $translit->transliterate($text);
    } else {
      $map = array(
          'а' => 'a',   'б' => 'b',   'в' => 'v',  'г' => 'g',  'д' => 'd',  'е' => 'e',  'ж' => 'zh', 'з' => 'z',
          'и' => 'i',   'й' => 'y',   'к' => 'k',  'л' => 'l',  'м' => 'm',  'н' => 'n',  'о' => 'o',  'п' => 'p',
          'р' => 'r',   'с' => 's',   'т' => 't',  'у' => 'u',  'ф' => 'f',  'х' => 'h',  'ц' => 'ts', 'ч' => 'ch',
          'ш' => 'sh',  'щ' => 'sht', 'ъ' => 'y',  'ы' => 'y',  'ь' => '\'', 'ю' => 'yu', 'я' => 'ya', 'А' => 'A',
          'Б' => 'B',   'В' => 'V',   'Г' => 'G',  'Д' => 'D',  'Е' => 'E',  'Ж' => 'Zh', 'З' => 'Z',  'И' => 'I',
          'Й' => 'Y',   'К' => 'K',   'Л' => 'L',  'М' => 'M',  'Н' => 'N',  'О' => 'O',  'П' => 'P',  'Р' => 'R',
          'С' => 'S',   'Т' => 'T',   'У' => 'U',  'Ф' => 'F',  'Х' => 'H',  'Ц' => 'Ts', 'Ч' => 'Ch', 'Ш' => 'Sh',
          'Щ' => 'Sht', 'Ъ' => 'Y',   'Ь' => '\'', 'Ю' => 'Yu', 'Я' => 'Ya'
      );
      $text = strtr($text, $map);
    }
    
    // lowercase
    $text = strtolower($text);
  
    // remove unwanted characters
    $text = preg_replace('~[^-\w]+~', '', $text);
  
    if (empty($text)) {
      $text = 'n-a';
    }
  
    return $text;
  }

  public function run(): void
  {
    // Если вдруг Faker не установлен - то просто ничего не делаем
    if (!class_exists('Faker\Factory')) {
      return;
    }

    // Временно отключаем проверку в БД по foreign key
    (new Eloquent())->getConnection()->getSchemaBuilder()->disableForeignKeyConstraints();
    // Чтобы можно было полностью очистить таблицы
    ProductCategory::query()->truncate();
    Category::query()->truncate();
    Product::query()->truncate();

    $faker = Faker\Factory::create();

    $categoryIds = [];

    foreach ($this->categories as $category_key => $categoryRaw) {
      $category = Category::query()->create([
        'title' => $categoryRaw['name'],
        'alias' => $this->slugify($categoryRaw['name']),
        'description' => null,
        'active' => true,
        'rank' => $category_key
      ]);
      $categoryIds[] = $category->id;

      if (!empty($categoryRaw['children'])) {
        foreach ($categoryRaw['children'] as $child_key => $childRaw) {
          $child = Category::query()->create([
            'title' => $childRaw['name'],
            'alias' => $this->slugify($categoryRaw['name'] . '-' . $childRaw['name']),
            'description' => null,
            'active' => true,
            'rank' => $child_key,
            'parent_id' => $category->id
          ]);
          $categoryIds[] = $child->id;
        }
      }
    }

    // Теперь 1000 товаров
    for ($i = 0; $i < $this->products; $i++) {
      $roduct = Product::query()->create([
        'title' => $faker->text(80),
        'alias' => 'product-' . ($i + 1),
        'description' => $faker->text,
        // Артикулом назначаем уникальное 9ти-значное число
        'sku' => $faker->unique()->randomNumber(9, true),
        // Цена тоже случайная, от 100.00 до 10000.99
        'price' => $faker->randomFloat(2, 100, 10000),
        // 10% товаров неактивны
        'active' => random_int(0, 9) > 0,
      ]);
      ProductCategory::query()->create([
        'product_id' => $roduct->id,
        'category_id' => $categoryIds[random_int(0, count($categoryIds) - 1)],
      ]);
    }
  }
}
