<?php

use App\Models\Category;
use App\Models\Product;
use Phinx\Seed\AbstractSeed;
use Vesp\Services\Eloquent;

class Products extends AbstractSeed
{
  // Количество генерируемых категорий
  protected $categories = 100;
  // И товаров
  protected $products = 1000;

  public function run(): void
  {
    // Если вдруг Faker не установлен - то просто ничего не делаем
    if (!class_exists('Faker\Factory')) {
      return;
    }

    // Временно отключаем проверку в БД по foreign key
    (new Eloquent())->getConnection()->getSchemaBuilder()
      ->disableForeignKeyConstraints();
    // Чтобы можно было полностью очистить таблицы
    Category::query()->truncate();
    Product::query()->truncate();

    $faker = Faker\Factory::create();

    // Создаём 100 категорий
    for ($i = 0; $i < $this->categories; $i++) {
      Category::query()->create([
        'title' => $faker->text(40),
        'alias' => 'category-' . ($i + 1),
        // Случайный lorem ipsum
        'description' => $faker->text,
        // Категория активна с вероятностью 90%
        'active' => random_int(0, 9) > 0,
      ]);
    }

    // Теперь 1000 товаров
    for ($i = 0; $i < $this->products; $i++) {
      Product::query()->create([
        'title' => $faker->text(80),
        'alias' => 'product-' . ($i + 1),
        'description' => $faker->text,
        // Указываем 1 из 100 категорий случайным образом
        'category_id' => random_int(1, $this->categories),
        // Артикулом назначаем уникальное 9ти-значное число
        'sku' => $faker->unique()->randomNumber(9, true),
        // Цена тоже случайная, от 100.00 до 10000.99
        'price' => $faker->randomFloat(2, 100, 10000),
        // 10% товаров неактивны
        'active' => random_int(0, 9) > 0,
      ]);
    }
  }
}
